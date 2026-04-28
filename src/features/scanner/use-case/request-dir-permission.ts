import type { Optional } from '@/shared/types/maybe'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle.ts'
import { verifyPermission } from '@/shared/lib/fsa'

export const requestDirPermission = async (
  fsHandleRepository: IFsHandleRepository,
): Promise<Optional<FileSystemDirectoryHandle>> => {
  try {
    const dir = await fsHandleRepository.get()
    if (!dir) {
      console.warn('requestDirPermission called but no directory handle found in DB — unexpected state')
      return
    }

    return (await verifyPermission(dir, { readWrite: true })) ? dir : undefined
  } catch (e) {
    console.error(e)
    throw new Error('Failed to request permission')
  }
}
