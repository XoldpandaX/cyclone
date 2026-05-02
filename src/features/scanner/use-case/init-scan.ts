import type { ScanStatus } from '@/features/scanner/model/scanner-store.ts'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import type { ILibraryRepository } from '@/shared/types/repositories/library.ts'

type IInitScanResult =
  | { status: 'processing'; dir: FileSystemDirectoryHandle }
  | { status: Extract<ScanStatus, 'ready' | 'no-folder'> }

export const initScan = async ({
  libraryRepository,
  fsHandleRepository,
}: {
  libraryRepository: ILibraryRepository
  fsHandleRepository: IFsHandleRepository
}): Promise<IInitScanResult> => {
  try {
    const [hasLibraryData, dir] = await Promise.all([libraryRepository.hasData(), fsHandleRepository.get()])
    return { status: hasLibraryData && dir ? 'ready' : 'no-folder' }
  } catch (e) {
    console.error(e)
    throw new Error('Failed to initialize scan')
  }
}
