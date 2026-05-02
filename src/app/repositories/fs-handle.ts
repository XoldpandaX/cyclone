import type { AppDb } from '../db'
import type { Optional } from '@/shared/types/maybe'
import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'

const MUSIC_FOLDER_KEY = 'music-folder'

export class FsHandleRepository implements IFsHandleRepository {
  constructor(private readonly db: AppDb) {}

  public async get(): Promise<Optional<FileSystemDirectoryHandle>> {
    const entry = await this.db.handles.get(MUSIC_FOLDER_KEY)
    return entry?.handle
  }

  public async put(handle: FileSystemDirectoryHandle): Promise<void> {
    await this.db.handles.put({ key: MUSIC_FOLDER_KEY, handle })
  }

  public async clear(): Promise<void> {
    await this.db.handles.clear()
  }
}
