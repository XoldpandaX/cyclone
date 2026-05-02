// import type { ScannerMessage } from './scanner-worker'
// import type { ITrackRecord } from '@/shared/types/record'
// import { useCallback, useEffect, useRef, useState } from 'react'

// import { useAppContext } from '@/app/app-context'
// import { openDir } from '@/shared/lib/fsa'

// import { Button } from '@/shared/ui-kit'
// import styles from './music-page.module.scss'

// type Status = 'initializing' | 'no-folder' | 'needs-permission' | 'scanning' | 'ready'

// interface ITrack {
//   record: ITrackRecord
// }

// interface IAlbum {
//   pathKey: string
//   name: string
//   tracks: ITrack[]
// }

// interface IScanProgress {
//   processed: number
//   total: number
// }

// const stripExtension = (name: string) => name.replace(/\.[^.]+$/, '')

// function albumsFromRecords(records: ITrackRecord[]): IAlbum[] {
//   const byPath = new Map<string, { name: string; tracks: ITrack[] }>()
//   for (const record of records) {
//     const key = record.pathSegments.join('/')
//     const entry = byPath.get(key)
//     const name = record.album ?? record.pathSegments.at(-1) ?? stripExtension(record.fileName)
//     if (entry) {
//       entry.tracks.push({ record })
//     } else {
//       byPath.set(key, { name, tracks: [{ record }] })
//     }
//   }
//   const albums: IAlbum[] = []
//   for (const [pathKey, { name, tracks }] of byPath) {
//     albums.push({
//       pathKey,
//       name,
//       tracks: tracks.sort((a, b) => {
//         const noA = a.record.no ?? Infinity
//         const noB = b.record.no ?? Infinity
//         if (noA !== noB) return noA - noB
//         return a.record.fileName.localeCompare(b.record.fileName)
//       }),
//     })
//   }
//   return albums.sort((a, b) => a.name.localeCompare(b.name))
// }

// function startScanWorker(
//   root: FileSystemDirectoryHandle,
//   existingTracks: ITrackRecord[],
//   onMessage: (msg: ScannerMessage) => void,
// ): Worker {
//   const worker = new Worker(new URL('./scanner-worker.ts', import.meta.url), { type: 'module' })
//   worker.onmessage = (e: MessageEvent<ScannerMessage>) => onMessage(e.data)
//   worker.onerror = () => onMessage({ type: 'error', message: 'Worker crashed' })
//   worker.postMessage({ root, existingTracks })
//   return worker
// }

// async function resolveFileHandle(
//   root: FileSystemDirectoryHandle,
//   pathSegments: string[],
//   fileName: string,
// ): Promise<FileSystemFileHandle> {
//   let dir: FileSystemDirectoryHandle = root
//   for (const segment of pathSegments) {
//     dir = await dir.getDirectoryHandle(segment)
//   }
//   return dir.getFileHandle(fileName)
// }

export function MusicPage() {
  // const { trackRepository, fsHandleRepository } = useAppContext()
  // const [status, setStatus] = useState<Status>('initializing')
  // const [scanProgress, setScanProgress] = useState<IScanProgress>({ processed: 0, total: 0 })
  // const [albums, setAlbums] = useState<IAlbum[]>([])
  // const [expanded, setExpanded] = useState<Set<string>>(new Set())
  // const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null)
  // const handleRef = useRef<FileSystemDirectoryHandle | null>(null)
  // const workerRef = useRef<Worker | null>(null)
  // const audioRef = useRef<HTMLAudioElement>(null)
  // const currentUrlRef = useRef<string | null>(null)

  // const runScan = useCallback(
  //   async (root: FileSystemDirectoryHandle) => {
  //     workerRef.current?.terminate()
  //     setStatus('scanning')
  //     setScanProgress({ processed: 0, total: 0 })

  //     const existingTracks = await trackRepository.getAll()

  //     workerRef.current = startScanWorker(root, existingTracks, async (msg) => {
  //       if (msg.type === 'total') {
  //         setScanProgress({ processed: 0, total: msg.count })
  //       } else if (msg.type === 'progress') {
  //         setScanProgress((prev) => ({ ...prev, processed: msg.processed }))
  //       } else if (msg.type === 'done') {
  //         workerRef.current?.terminate()
  //         // eslint-disable-next-line no-console
  //         console.info(`${msg.failed.length} failed tracks`, msg.failed)
  //         await trackRepository.bulkPut(msg.newRecords)
  //         setAlbums(albumsFromRecords(msg.records))
  //         setStatus('ready')
  //       } else if (msg.type === 'error') {
  //         workerRef.current?.terminate()
  //         setStatus('ready')
  //       }
  //     })
  //   },
  //   [trackRepository],
  // )

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const [records, saved] = await Promise.all([
  //         trackRepository.getAll(),
  //         fsHandleRepository.get(),
  //       ])

  //       if (saved) {
  //         handleRef.current = saved
  //       }

  //       if (records.length > 0) {
  //         setAlbums(albumsFromRecords(records))
  //         setStatus('ready')
  //       } else if (saved) {
  //         const permission = await saved.queryPermission({ mode: 'read' })
  //         if (permission === 'granted') {
  //           void runScan(saved)
  //         } else {
  //           setStatus('needs-permission')
  //         }
  //       } else {
  //         setStatus('no-folder')
  //       }
  //     } catch {
  //       setStatus('no-folder')
  //     }
  //   }
  //   void init()
  // }, [trackRepository, fsHandleRepository, runScan])

  // const openFolder = async () => {
  //   try {
  //     const dir = await openDir()
  //     await fsHandleRepository.put(dir)
  //     handleRef.current = dir
  //     void runScan(dir)
  //   } catch {
  //     // user cancelled
  //   }
  // }

  // const restoreAccess = async () => {
  //   const dir = handleRef.current
  //   if (!dir) return
  //   const permission = await dir.requestPermission({ mode: 'read' })
  //   if (permission === 'granted') runScan(dir)
  // }

  // const toggleAlbum = (pathKey: string) => {
  //   setExpanded((prev) => {
  //     const next = new Set(prev)
  //     if (next.has(pathKey)) next.delete(pathKey)
  //     else next.add(pathKey)
  //     return next
  //   })
  // }

  // const play = async (track: ITrack) => {
  //   const dir = handleRef.current
  //   if (!dir) return

  //   const permission = await dir.requestPermission({ mode: 'read' })
  //   if (permission !== 'granted') return

  //   const fileHandle = await resolveFileHandle(
  //     dir,
  //     track.record.pathSegments,
  //     track.record.fileName,
  //   )
  //   const file = await fileHandle.getFile()

  //   if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current)
  //   const url = URL.createObjectURL(file)
  //   currentUrlRef.current = url

  //   if (audioRef.current) {
  //     audioRef.current.src = url
  //     void audioRef.current.play()
  //   }

  //   setCurrentTrack(track)
  // }

  // const isPlaying = (track: ITrack) => currentTrack?.record.id === track.record.id

  return <div>music-page</div>
}
