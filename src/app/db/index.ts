import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record/library'
import type { IPlaylistItemRecord, IPlaylistRecord } from '@/shared/types/record/playlist'
import { Dexie, type EntityTable, type Transaction } from 'dexie'
import { uuid } from '@/shared/lib/crypto'

export interface IFsHandleEntry {
  key: string
  handle: FileSystemDirectoryHandle
}

export class AppDb extends Dexie {
  artists!: EntityTable<IArtistRecord, 'id'>
  albums!: EntityTable<IAlbumRecord, 'id'>
  tracks!: EntityTable<ITrackRecord, 'id'>
  playlists!: EntityTable<IPlaylistRecord, 'id'>
  playlistItems!: EntityTable<IPlaylistItemRecord, 'id'>
  handles!: EntityTable<IFsHandleEntry, 'key'>

  public constructor() {
    super('cyclone-db')
    this.version(1).stores({
      artists: 'id, artist',
      albums: 'id, artistId, album',
      tracks: 'id, albumId, title',
      playlists: 'id',
      playlistItems: 'id, playlistId, trackId',
      handles: 'key',
    })

    this.on('ready', this.checkIntegrity)
    this.on('populate', this.populate)
  }

  private checkIntegrity = async (): Promise<void> => {
    const expectedTables = ['artists', 'albums', 'tracks', 'handles']
    const existingTables = new Set(this.tables.map((table) => table.name))
    const hasMissingTables = expectedTables.some((table) => !existingTables.has(table))

    if (hasMissingTables) {
      await this.delete()
      await this.open()

      return
    }

    const counts = await Promise.all([this.artists.count(), this.albums.count(), this.tracks.count(), this.handles.count()])
    const hasEmptyTables = counts.includes(0)
    const hasNonEmptyTables = counts.some((count) => count > 0)

    const hasInconsistentData = hasEmptyTables && hasNonEmptyTables
    if (hasInconsistentData) {
      await Promise.all([this.artists.clear(), this.albums.clear(), this.tracks.clear(), this.handles.clear()])
    }
  }

  private async populate(tx: Transaction): Promise<void> {
    const playlists = tx.table('playlists') as EntityTable<IPlaylistRecord, 'id'>
    await playlists.add({ id: uuid(), name: 'Playlist 1' })
  }
}
