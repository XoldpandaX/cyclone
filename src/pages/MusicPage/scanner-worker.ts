import type { ITrackRecord } from '@/shared/types/record'
import { withConcurrency } from '@/shared/lib/concurency'
import { createTrackRecord, isAudio, trackId, tryParseAudio } from './utils'

interface IFileEntry {
  fileHandle: FileSystemFileHandle
  pathSegments: string[]
}

// const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export type ScannerMessage =
  | { type: 'total'; count: number }
  | { type: 'progress'; processed: number }
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
    listener: (
      e: MessageEvent<{ root: FileSystemDirectoryHandle; existingTracks: ITrackRecord[] }>,
    ) => void,
  ) => void
}

ctx.addEventListener(
  'message',
  async (e: MessageEvent<{ root: FileSystemDirectoryHandle; existingTracks: ITrackRecord[] }>) => {
    try {
      const startedAt = performance.now()
      const entries = await collectFileEntries(e.data.root)

      ctx.postMessage({ type: 'total', count: entries.length } satisfies ScannerMessage)

      const tracksMap = new Map(e.data.existingTracks.map((r) => [r.id, r]))

      const newRecords: ITrackRecord[] = []
      const allRecords: ITrackRecord[] = []
      const failedRecords: Array<{ id: string; error: string }> = []
      let processed = 0

      // Concurrency of 400 is empirically fastest with p-limit + 256KB slicing — tested 100/200/400.
      // p-limit's queue handles higher concurrency better than the custom worker-loop (100 = 3.66s, 400 = 3.15s).
      await withConcurrency(entries, 400, async ({ fileHandle, pathSegments }): Promise<void> => {
        const id = trackId(pathSegments, fileHandle.name)
        let trackRecord = tracksMap.get(id)

        if (!trackRecord) {
          try {
            const file = await fileHandle.getFile()
            let audioMetadata = await tryParseAudio(file.slice(0, 256 * 1024), file.type)
            if (!audioMetadata.common.title && !audioMetadata.common.artist) {
              audioMetadata = await tryParseAudio(file, file.type)
            }

            trackRecord = createTrackRecord(
              id,
              fileHandle.name,
              pathSegments,
              file.type,
              audioMetadata,
            )
            newRecords.push(trackRecord)
          } catch (err) {
            const error = String(err)
            failedRecords.push({ id, error })
            console.error(`Failed to parse track "${id}":`, err)
            ctx.postMessage({ type: 'progress', processed: ++processed } satisfies ScannerMessage)
            return
          }
        }

        allRecords.push(trackRecord)
        ctx.postMessage({ type: 'progress', processed: ++processed } satisfies ScannerMessage)
      })

      // eslint-disable-next-line no-console
      console.info(
        `Scan complete: ${allRecords.length} tracks, ${failedRecords.length} failed in ${((performance.now() - startedAt) / 1000).toFixed(2)}s`,
      )
      ctx.postMessage({
        type: 'done',
        records: allRecords,
        newRecords,
        failed: failedRecords,
      } satisfies ScannerMessage)
    } catch (err) {
      ctx.postMessage({ type: 'error', message: String(err) } satisfies ScannerMessage)
    }
  },
)

async function collectFileEntries(
  dir: FileSystemDirectoryHandle,
  pathSegments: string[] = [],
): Promise<IFileEntry[]> {
  const files: IFileEntry[] = []
  const subdirs: FileSystemDirectoryHandle[] = []

  for await (const entry of dir.values()) {
    if (entry.kind === 'file' && isAudio(entry.name)) {
      files.push({ fileHandle: entry, pathSegments })
    } else if (entry.kind === 'directory') {
      subdirs.push(entry)
    }
  }

  const nested = await Promise.all(
    subdirs.map((sub) => collectFileEntries(sub, [...pathSegments, sub.name])),
  )

  return files.concat(...nested)
}
