import type { ScannerMessage } from '../workers/scan-music-dir'
import type { ITrackRecord } from '@/shared/types/record'
import type { ITrackRepository } from '@/shared/types/repositories/track.ts'

interface IRunScanUseCaseInput {
  dir: FileSystemDirectoryHandle
  trackRepository: ITrackRepository
  onProgressChange: (progress: {
    processed: number
    total: number
    filePath: string
    fileName: string
  }) => void
  onStatusChange: (status: 'ready' | 'error') => void
}

export const runScanUseCase = async ({
  dir,
  trackRepository,
  onProgressChange,
  onStatusChange,
}: IRunScanUseCaseInput): Promise<void> => {
  try {
    let count: number = 0

    const worker = runScanMusicDirWorker(dir, [], {
      onMessage: async (msg) => {
        if (['done', 'error'].includes(msg.type)) {
          onProgressChange({ processed: 0, total: 0, filePath: '', fileName: '' })
        }

        switch (msg.type) {
          case 'total':
            onProgressChange({
              processed: 0,
              total: msg.count,
              filePath: '',
              fileName: '',
            })
            count = msg.count
            break
          case 'progress':
            onProgressChange({
              processed: msg.processed,
              total: count,
              filePath: msg.filePath,
              fileName: msg.fileName,
            })
            break
          case 'done':
            console.warn(`${msg.failed.length} failed tracks`, msg.failed)
            await trackRepository.bulkPut(msg.newRecords)
            worker.terminate()
            onStatusChange('ready')
            break
          case 'error':
            worker.terminate()
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

function runScanMusicDirWorker(
  root: FileSystemDirectoryHandle,
  existingTracks: ITrackRecord[],
  { onMessage }: { onMessage: (msg: ScannerMessage) => void },
): Worker {
  const worker = new Worker(new URL('../workers/scan-music-dir.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e: MessageEvent<ScannerMessage>) => onMessage(e.data)
  worker.onerror = () => onMessage({ type: 'error', message: 'Worker crashed' })
  worker.postMessage({ root, existingTracks })
  return worker
}
