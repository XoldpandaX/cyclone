import type { IFullRawTrackData, ScannerMessage } from '../workers/scan-music-dir/types'
import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record/library'
import type { ILibraryRepository } from '@/shared/types/repositories/library'

interface IRunScanUseCaseInput {
  dir: FileSystemDirectoryHandle
  libraryRepository: ILibraryRepository
  onProgressChange: (progress: { processed: number; filePath: string; fileName: string }) => void
  onStatusChange: (status: 'ready' | 'error') => void
}

export const runScanUseCase = async ({
  dir,
  libraryRepository,
  onProgressChange,
  onStatusChange,
}: IRunScanUseCaseInput): Promise<void> => {
  try {
    let processedTracks: number = 0

    const worker = runScanMusicDirWorker(dir, [], {
      onMessage: async (msg) => {
        switch (msg.type) {
          case 'progress':
            onProgressChange({
              processed: msg.processed,
              filePath: msg.filePath,
              fileName: msg.fileName,
            })
            processedTracks = msg.processed
            break
          case 'done':
            worker.terminate()
            await libraryRepository.loadData(normalizeRawTracks(msg.tracks))
            onProgressChange({ processed: processedTracks, filePath: '', fileName: '' })
            onStatusChange('ready')
            // TODO: Add notification to a user
            console.warn(`${msg.failed.length} failed tracks`, msg.failed)
            break
          case 'error':
            worker.terminate()
            onProgressChange({ processed: 0, filePath: '', fileName: '' })
            onStatusChange('error')
            break
          default: {
            const _exhaustive: never = msg
            throw new Error(`Unhandled message type: ${JSON.stringify(_exhaustive)}`)
          }
        }
      },
    })
  } catch (e) {
    console.error(e)
  }
}

function normalizeRawTracks(rawTracks: IFullRawTrackData[]): {
  artists: IArtistRecord[]
  albums: IAlbumRecord[]
  tracks: ITrackRecord[]
} {
  const artists = new Map<string, IArtistRecord>()
  const albums = new Map<string, IAlbumRecord>()
  const tracks: ITrackRecord[] = []

  for (let i = 0; i < rawTracks.length; i++) {
    const track = rawTracks[i]
    if (!track) continue

    const { artistId, uniqArtist, albumId, meta } = track
    if (!artists.has(artistId)) {
      artists.set(artistId, { id: artistId, artist: uniqArtist })
    }

    if (!albums.has(albumId)) {
      // TODO: add cover if exists to an album
      albums.set(albumId, { id: albumId, artistId, album: meta.album?.trim() || 'Unknown Album', cover: '' })
    }

    tracks.push({
      id: track.id,
      artistId,
      albumId,
      fileName: track.fileName,
      pathSegments: track.pathSegments,
      mimeType: track.mimeType,
      title: meta.title ?? '',
      album: meta.album ?? '',
      albumArtist: meta.albumArtist ?? '',
      artist: meta.artist ?? '',
      year: meta.year,
      duration: meta.duration,
      no: meta.track.no,
      of: meta.track.of,
    })
  }

  return {
    artists: Array.from(artists.values()),
    albums: Array.from(albums.values()),
    tracks,
  }
}

function runScanMusicDirWorker(
  root: FileSystemDirectoryHandle,
  existingTracks: ITrackRecord[],
  { onMessage }: { onMessage: (msg: ScannerMessage) => void },
): Worker {
  const worker = new Worker(new URL('../workers/scan-music-dir/worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e: MessageEvent<ScannerMessage>) => onMessage(e.data)
  worker.onerror = () => onMessage({ type: 'error', message: 'Worker crashed' })
  worker.postMessage({ root, existingTracks })
  return worker
}
