import type { IAudioMetadata } from 'music-metadata'
import type { IFileEntry, IMinimalRawTrackData, ScannerMessage } from './types'
import { withConcurrency } from '@/shared/lib/concurency'
import { uuid } from '@/shared/lib/crypto'
import { orNull } from '@/shared/lib/maybe'
import { isAudio, tryParseAudio } from '../../utils'
import { buildTrackRelations } from './build-track-relations'

const ctx = globalThis as unknown as {
  postMessage: (data: ScannerMessage) => void
  addEventListener: (type: 'message', listener: (e: MessageEvent<{ root: FileSystemDirectoryHandle }>) => void) => void
}

ctx.addEventListener('message', async (e: MessageEvent<{ root: FileSystemDirectoryHandle }>) => {
  try {
    const startedAt = performance.now()
    const records: IMinimalRawTrackData[] = []
    const failedRecords: Array<{ id: string; error: string }> = []
    let processed = 0

    // Concurrency of 400 is empirically fastest with p-limit + 256KB slicing — tested 100/200/400.
    // p-limit's queue handles higher concurrency better than the custom worker-loop (100 = 3.66s, 400 = 3.15s).
    await withConcurrency(walkFileEntries(e.data.root), 400, async ({ fileHandle, pathSegments }): Promise<void> => {
      const id = uuid()

      try {
        const file = await fileHandle.getFile()
        let audioMetadata = await tryParseAudio(file.slice(0, 256 * 1024), file.type)
        if (!audioMetadata.common.title && !audioMetadata.common.artist && !audioMetadata.common.album) {
          audioMetadata = await tryParseAudio(file, file.type)
        }

        records.push(createMinimalRawTrackData(id, fileHandle.name, pathSegments, file.type, audioMetadata))
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
      }

      ctx.postMessage({
        type: 'progress',
        processed: ++processed,
        filePath: pathSegments.join('/'),
        fileName: fileHandle.name,
      } satisfies ScannerMessage)
    })

    // eslint-disable-next-line no-console
    console.info(
      `Scan complete: ${records.length} tracks, ${failedRecords.length} failed in ${((performance.now() - startedAt) / 1000).toFixed(2)}s`,
    )
    ctx.postMessage({
      type: 'done',
      tracks: buildTrackRelations(records),
      failed: failedRecords,
    } satisfies ScannerMessage)
  } catch (err) {
    ctx.postMessage({ type: 'error', message: String(err) } satisfies ScannerMessage)
  }
})

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

function createMinimalRawTrackData(
  id: string,
  fileName: string,
  pathSegments: string[],
  mimeType: string,
  meta: IAudioMetadata,
): IMinimalRawTrackData {
  const { common, format } = meta

  return {
    id,
    fileName,
    pathSegments,
    mimeType,
    meta: {
      track: common.track,
      album: orNull(common.album),
      albumArtist: orNull(common.albumartist),
      artist: orNull(common.artist),
      title: orNull(common.title),
      year: orNull(common.year),
      duration: orNull(format.duration),
    },
  }
}
