import type { Optional } from '@/shared/types/maybe'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import { openDir } from '@/shared/lib/fsa'

export const openScanFolder = async (
  fsHandleRepository: IFsHandleRepository,
): Promise<Optional<FileSystemDirectoryHandle>> => {
  try {
    const dir = await openDir()
    await fsHandleRepository.put(dir)
    return dir
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return
    }

    console.error(e)
    throw new Error('Failed to open directory')
  }
}
