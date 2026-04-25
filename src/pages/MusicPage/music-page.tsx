import type { ScannerMessage } from './scanner-worker'
import type { ITrackRecord } from '@/shared/types/record'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useAppContext } from '@/app/app-context'
import { openDir } from '@/shared/lib/fsa'

import { Button } from '@/shared/ui-kit/Button/button'
import styles from './music-page.module.scss'

type Status = 'initializing' | 'no-folder' | 'needs-permission' | 'scanning' | 'ready'

interface ITrack {
  record: ITrackRecord
}

interface IAlbum {
  pathKey: string
  name: string
  tracks: ITrack[]
}

interface IScanProgress {
  processed: number
  total: number
}

const stripExtension = (name: string) => name.replace(/\.[^.]+$/, '')

function albumsFromRecords(records: ITrackRecord[]): IAlbum[] {
  const byPath = new Map<string, { name: string; tracks: ITrack[] }>()
  for (const record of records) {
    const key = record.pathSegments.join('/')
    const entry = byPath.get(key)
    const name = record.album ?? record.pathSegments.at(-1) ?? stripExtension(record.fileName)
    if (entry) {
      entry.tracks.push({ record })
    } else {
      byPath.set(key, { name, tracks: [{ record }] })
    }
  }
  const albums: IAlbum[] = []
  for (const [pathKey, { name, tracks }] of byPath) {
    albums.push({
      pathKey,
      name,
      tracks: tracks.sort((a, b) => {
        const noA = a.record.no ?? Infinity
        const noB = b.record.no ?? Infinity
        if (noA !== noB) return noA - noB
        return a.record.fileName.localeCompare(b.record.fileName)
      }),
    })
  }
  return albums.sort((a, b) => a.name.localeCompare(b.name))
}

function startScanWorker(
  root: FileSystemDirectoryHandle,
  existingTracks: ITrackRecord[],
  onMessage: (msg: ScannerMessage) => void,
): Worker {
  const worker = new Worker(new URL('./scanner-worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (e: MessageEvent<ScannerMessage>) => onMessage(e.data)
  worker.onerror = () => onMessage({ type: 'error', message: 'Worker crashed' })
  worker.postMessage({ root, existingTracks })
  return worker
}

async function resolveFileHandle(
  root: FileSystemDirectoryHandle,
  pathSegments: string[],
  fileName: string,
): Promise<FileSystemFileHandle> {
  let dir: FileSystemDirectoryHandle = root
  for (const segment of pathSegments) {
    dir = await dir.getDirectoryHandle(segment)
  }
  return dir.getFileHandle(fileName)
}

export function MusicPage() {
  const { trackRepository, fsHandleRepository } = useAppContext()
  const [status, setStatus] = useState<Status>('initializing')
  const [scanProgress, setScanProgress] = useState<IScanProgress>({ processed: 0, total: 0 })
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null)
  const handleRef = useRef<FileSystemDirectoryHandle | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentUrlRef = useRef<string | null>(null)

  const runScan = useCallback(
    async (root: FileSystemDirectoryHandle) => {
      workerRef.current?.terminate()
      setStatus('scanning')
      setScanProgress({ processed: 0, total: 0 })

      const existingTracks = await trackRepository.getAll()

      workerRef.current = startScanWorker(root, existingTracks, async (msg) => {
        if (msg.type === 'total') {
          setScanProgress({ processed: 0, total: msg.count })
        } else if (msg.type === 'progress') {
          setScanProgress((prev) => ({ ...prev, processed: msg.processed }))
        } else if (msg.type === 'done') {
          workerRef.current?.terminate()
          // eslint-disable-next-line no-console
          console.info(`${msg.failed.length} failed tracks`, msg.failed)
          await trackRepository.bulkPut(msg.newRecords)
          setAlbums(albumsFromRecords(msg.records))
          setStatus('ready')
        } else if (msg.type === 'error') {
          workerRef.current?.terminate()
          setStatus('ready')
        }
      })
    },
    [trackRepository],
  )

  useEffect(() => {
    const init = async () => {
      try {
        //Получаем все треки и dir handle
        const [records, saved] = await Promise.all([
          trackRepository.getAll(),
          fsHandleRepository.get(),
        ])

        //Сохраняем dir handle если есть
        if (saved) {
          handleRef.current = saved
        }

        //Если треки есть то статус ready
        if (records.length > 0) {
          setAlbums(albumsFromRecords(records))
          setStatus('ready')
          //Также если есть dir handle
        } else if (saved) {
          //Про
          const permission = await saved.queryPermission({ mode: 'read' })
          if (permission === 'granted') {
            void runScan(saved)
          } else {
            setStatus('needs-permission')
          }
        } else {
          setStatus('no-folder')
        }
      } catch {
        setStatus('no-folder')
      }
    }
    void init()
  }, [trackRepository, fsHandleRepository, runScan])

  const openFolder = async () => {
    try {
      const dir = await openDir()
      await fsHandleRepository.put(dir)
      handleRef.current = dir
      void runScan(dir)
    } catch {
      // user cancelled
    }
  }

  const restoreAccess = async () => {
    const dir = handleRef.current
    if (!dir) return
    const permission = await dir.requestPermission({ mode: 'read' })
    if (permission === 'granted') runScan(dir)
  }

  const toggleAlbum = (pathKey: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(pathKey)) next.delete(pathKey)
      else next.add(pathKey)
      return next
    })
  }

  const play = async (track: ITrack) => {
    const dir = handleRef.current
    if (!dir) return

    const permission = await dir.requestPermission({ mode: 'read' })
    if (permission !== 'granted') return

    const fileHandle = await resolveFileHandle(
      dir,
      track.record.pathSegments,
      track.record.fileName,
    )
    const file = await fileHandle.getFile()

    if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current)
    const url = URL.createObjectURL(file)
    currentUrlRef.current = url

    if (audioRef.current) {
      audioRef.current.src = url
      void audioRef.current.play()
    }

    setCurrentTrack(track)
  }

  const isPlaying = (track: ITrack) => currentTrack?.record.id === track.record.id

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Music — File System API Hypothesis</h1>

      {status === 'initializing' && <p className={styles.status}>Initializing...</p>}

      {status === 'no-folder' && <Button onClick={openFolder}>Open Music Folder</Button>}

      {status === 'needs-permission' && (
        <>
          <p className={styles.status}>Folder found in IndexedDB but permission expired.</p>
          <Button onClick={restoreAccess}>Restore Access</Button>
          <Button onClick={openFolder} style={{ marginLeft: '0.5rem' }}>
            Open Different Folder
          </Button>
        </>
      )}

      {status === 'scanning' && (
        <p className={styles.status}>
          Scanning... {scanProgress.processed} / {scanProgress.total} tracks
        </p>
      )}

      {status === 'ready' && (
        <>
          <div className={styles.toolbar}>
            <span className={styles.status}>{albums.length} albums</span>
            <Button onClick={openFolder}>Change Folder</Button>
          </div>

          <ul className={styles.albumList}>
            {albums.map((album) => (
              <li key={album.pathKey} className={styles.album}>
                <button
                  type="button"
                  className={styles.albumHeader}
                  onClick={() => toggleAlbum(album.pathKey)}
                >
                  <span className={styles.chevron}>{expanded.has(album.pathKey) ? '▾' : '▸'}</span>
                  {album.name}
                  <span className={styles.trackCount}>{album.tracks.length} tracks</span>
                </button>

                {expanded.has(album.pathKey) && (
                  <ul className={styles.trackList}>
                    {album.tracks.map((track) => (
                      <li
                        key={track.record.id}
                        className={`${styles.track} ${isPlaying(track) ? styles.active : ''}`}
                        onDoubleClick={() => play(track)}
                      >
                        <span className={styles.trackName}>
                          {track.record.title ?? stripExtension(track.record.fileName)}
                        </span>
                        {track.record.artist && (
                          <span className={styles.artist}>{track.record.artist}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div
            className={styles.player}
            style={{ visibility: currentTrack ? 'visible' : 'hidden' }}
          >
            <p className={styles.nowPlaying}>
              {currentTrack?.record.artist ?? currentTrack?.record.album} —{' '}
              {currentTrack
                ? (currentTrack.record.title ?? stripExtension(currentTrack.record.fileName))
                : ''}
            </p>
            <audio ref={audioRef} controls className={styles.audio} />
          </div>
        </>
      )}
    </div>
  )
}
