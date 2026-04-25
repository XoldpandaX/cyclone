import type { ITrackRecord } from '@/shared/types/record'
import { Dexie, type Table } from 'dexie'

export interface IFsHandleEntry {
  key: string
  handle: FileSystemDirectoryHandle
}

export class AppDb extends Dexie {
  tracks!: Table<ITrackRecord, string>
  handles!: Table<IFsHandleEntry, string>

  public constructor() {
    super('cyclone-db')
    this.version(1).stores({
      tracks: 'id',
      handles: 'key',
    })
  }
}

export type { Table } from 'dexie'
