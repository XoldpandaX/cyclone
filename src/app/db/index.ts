import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record/library.ts'
import { Dexie, type EntityTable } from 'dexie'

export interface IFsHandleEntry {
  key: string
  handle: FileSystemDirectoryHandle
}

export class AppDb extends Dexie {
  artists!: EntityTable<IArtistRecord, 'id'>
  albums!: EntityTable<IAlbumRecord, 'id'>
  tracks!: EntityTable<ITrackRecord, 'id'>
  handles!: EntityTable<IFsHandleEntry, 'key'>

  public constructor() {
    super('cyclone-db')
    this.version(1).stores({
      artists: 'id, artist',
      albums: 'id, artistId, album',
      tracks: 'id, albumId, title',
      handles: 'key',
    })

    this.on('ready', this.checkIntegrity)
  }

  private checkIntegrity = async (): Promise<void> => {
    const tableNames = this.tables.map((t) => t.name)
    const expected = ['artists', 'albums', 'tracks', 'handles']
    const hasMissing = expected.some((name) => !tableNames.includes(name))

    if (hasMissing) {
      await this.delete()
      await this.open()
      return
    }

    const [artists, albums, tracks] = await Promise.all([this.artists.count(), this.albums.count(), this.tracks.count()])

    const counts = { artists, albums, tracks }
    const hasInconsistentData = Object.values(counts).some((c) => c > 0) && Object.values(counts).includes(0)

    if (hasInconsistentData) {
      await this.artists.clear()
      await this.albums.clear()
      await this.tracks.clear()
    }
  }
}
