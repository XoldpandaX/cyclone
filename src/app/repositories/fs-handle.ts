import type { IFsHandleEntry, Table } from '../db'
import type { Optional } from '@/shared/types/maybe'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'

const MUSIC_FOLDER_KEY = 'music-folder'

export class FsHandleRepository implements IFsHandleRepository {
  constructor(private readonly handles: Table<IFsHandleEntry, string>) {}

  public async get(): Promise<Optional<FileSystemDirectoryHandle>> {
    const entry = await this.handles.get(MUSIC_FOLDER_KEY)
    return entry?.handle
  }

  public async put(handle: FileSystemDirectoryHandle): Promise<void> {
    await this.handles.put({ key: MUSIC_FOLDER_KEY, handle })
  }
}
