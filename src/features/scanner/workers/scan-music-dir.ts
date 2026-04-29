import type { Optional } from '@/shared/types/maybe'
import type { ITrackRecord } from '@/shared/types/record'
import { withConcurrency } from '@/shared/lib/concurency'
import { uuid } from '@/shared/lib/crypto'
import { createTrackRecord, isAudio, tryParseAudio } from '../utils'

interface IFileEntry {
  fileHandle: FileSystemFileHandle
  pathSegments: string[]
}

export type ScannerMessage =
  | { type: 'progress'; filePath: string; fileName: string; processed: number }
  | {
      type: 'done'
      records: ITrackRecord[]
      newRecords: ITrackRecord[]
      failed: Array<{ id: string; error: string }>
    }
  | { type: 'error'; message: string }

const ctx = globalThis as unknown as {
  postMessage: (data: ScannerMessage) => void
  addEventListener: (
    type: 'message',
    listener: (e: MessageEvent<{ root: FileSystemDirectoryHandle; existingTracks: ITrackRecord[] }>) => void,
  ) => void
}

ctx.addEventListener(
  'message',
  async (e: MessageEvent<{ root: FileSystemDirectoryHandle; existingTracks: ITrackRecord[] }>) => {
    try {
      const startedAt = performance.now()
      const newRecords: ITrackRecord[] = []
      const allRecords: ITrackRecord[] = []
      const failedRecords: Array<{ id: string; error: string }> = []
      let processed = 0

      // Concurrency of 400 is empirically fastest with p-limit + 256KB slicing — tested 100/200/400.
      // p-limit's queue handles higher concurrency better than the custom worker-loop (100 = 3.66s, 400 = 3.15s).
      await withConcurrency(walkFileEntries(e.data.root), 400, async ({ fileHandle, pathSegments }): Promise<void> => {
        const id = uuid()
        let trackRecord: Optional<ITrackRecord>

        try {
          const file = await fileHandle.getFile()
          let audioMetadata = await tryParseAudio(file.slice(0, 256 * 1024), file.type)
          if (!audioMetadata.common.title && !audioMetadata.common.artist && !audioMetadata.common.album) {
            audioMetadata = await tryParseAudio(file, file.type)
          }

          trackRecord = createTrackRecord(id, fileHandle.name, pathSegments, file.type, audioMetadata)
          newRecords.push(trackRecord)
        } catch (err) {
          const error = String(err)
          failedRecords.push({ id, error })
          console.error(`Failed to parse track "${id}":`, err)
          ctx.postMessage({
            type: 'progress',
            processed: ++processed,
            filePath: pathSegments.join('/'),
            fileName: fileHandle.name,
          } satisfies ScannerMessage)
          return
        }

        allRecords.push(trackRecord)
        ctx.postMessage({
          type: 'progress',
          processed: ++processed,
          filePath: pathSegments.join('/'),
          fileName: fileHandle.name,
        } satisfies ScannerMessage)
      })

      // eslint-disable-next-line no-console
      console.info(
        `Scan complete: ${allRecords.length} tracks, ${failedRecords.length} failed in ${((performance.now() - startedAt) / 1000).toFixed(2)}s`,
      )
      ctx.postMessage({
        type: 'done',
        records: allRecords,
        newRecords: resolveAlbumArtists(newRecords),
        failed: failedRecords,
      } satisfies ScannerMessage)
    } catch (err) {
      ctx.postMessage({ type: 'error', message: String(err) } satisfies ScannerMessage)
    }
  },
)

function resolveAlbumArtists(tracks: ITrackRecord[]): ITrackRecord[] {
  const unknownAlbum = 'Unknown Album'
  const variousArtists = 'Various artists'

  const tracksGroupedByAlbum: Map<string, ITrackRecord[]> = new Map()
  for (const track of tracks) {
    const trackAlbum = track.album ?? unknownAlbum

    if (!tracksGroupedByAlbum.has(trackAlbum)) {
      tracksGroupedByAlbum.set(trackAlbum, [])
    }

    const album = tracksGroupedByAlbum.get(trackAlbum)
    if (album) {
      album.push(track)
    }
  }

  for (const [albumName, albumTracks] of tracksGroupedByAlbum) {
    const hasUniqArtist = [...new Set(albumTracks.map(({ artist }) => artist))].length === 1
    tracksGroupedByAlbum.set(
      albumName,
      albumTracks.map((track) => ({ ...track, albumArtist: !hasUniqArtist ? variousArtists : track.artist })),
    )
  }

  const result: ITrackRecord[] = []
  for (const tracks of tracksGroupedByAlbum.values()) {
    result.push(...tracks)
  }

  return result
}

// Generator approach — lazy traversal, bounded memory regardless of library size (see https://github.com/whatwg/fs/issues/184).
// At any moment only ~concurrency (400) handles are alive. Does not support percentage progress
// since total is unknown upfront.
async function* walkFileEntries(dir: FileSystemDirectoryHandle, pathSegments: string[] = []): AsyncGenerator<IFileEntry> {
  for await (const entry of dir.values()) {
    if (entry.kind === 'file' && isAudio(entry.name)) {
      yield { fileHandle: entry, pathSegments }
    } else if (entry.kind === 'directory') {
      yield* walkFileEntries(entry, [...pathSegments, entry.name])
    }
  }
}
