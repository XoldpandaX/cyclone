import type { Optional } from '@/shared/types/maybe'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle.ts'

export const requestDirPermission = async (
  fsHandleRepository: IFsHandleRepository,
): Promise<Optional<FileSystemDirectoryHandle>> => {
  try {
    const dir = await fsHandleRepository.get()
    if (!dir) {
      console.warn(
        'requestDirPermission called but no directory handle found in DB — unexpected state',
      )
      return
    }

    const permission = await dir.requestPermission({ mode: 'read' })
    return permission === 'granted' ? dir : undefined
  } catch (e) {
    console.error(e)
    throw new Error('Failed to request permission')
  }
}
