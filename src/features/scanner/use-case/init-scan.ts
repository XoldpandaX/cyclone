import type { ScanStatus } from '@/features/scanner/model/scanner-store.ts'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import type { ITrackRepository } from '@/shared/types/repositories/track.ts'

type IInitScanResult =
  | { status: 'processing'; dir: FileSystemDirectoryHandle }
  | { status: Extract<ScanStatus, 'ready' | 'no-folder'> }

export const initScan = async ({
  trackRepository,
  fsHandleRepository,
}: {
  trackRepository: ITrackRepository
  fsHandleRepository: IFsHandleRepository
}): Promise<IInitScanResult> => {
  try {
    const [tracks, dir] = await Promise.all([trackRepository.getAll(), fsHandleRepository.get()])
    const hasTracks = tracks.length > 0

    if (hasTracks && dir) {
      return { status: 'ready' }
    }

    const isDataInconsistent = (hasTracks && !dir) || (dir && !hasTracks)
    if (isDataInconsistent) {
      await Promise.all([trackRepository.clear(), fsHandleRepository.clear()])
      return { status: 'no-folder' }
    }

    return { status: 'no-folder' }
  } catch (e) {
    console.error(e)
    throw new Error('Failed to initialize scan')
  }
}
