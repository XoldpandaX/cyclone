import type { Optional } from '@/shared/types/maybe'

export interface IFsHandleRepository {
  get: () => Promise<Optional<FileSystemDirectoryHandle>>
  put: (handle: FileSystemDirectoryHandle) => Promise<void>
  clear: () => Promise<void>
}
