import type { AppDb } from '../db'
import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record/library.ts'
import type { ILibraryRepository } from '@/shared/types/repositories/library.ts'

export class LibraryRepository implements ILibraryRepository {
  constructor(private readonly db: AppDb) {}

  public async loadData(data: { artists: IArtistRecord[]; albums: IAlbumRecord[]; tracks: ITrackRecord[] }): Promise<void> {
    this.db.transaction('rw', [this.db.artists, this.db.albums, this.db.tracks], async () => {
      await this.db.artists.bulkPut(data.artists)
      await this.db.albums.bulkPut(data.albums)
      await this.db.tracks.bulkPut(data.tracks)
    })
  }

  public async getArtists(): Promise<IArtistRecord[]> {
    return this.db.artists.orderBy('artist').toArray()
  }

  public async getAlbumsByArtistId(artistId: string): Promise<IAlbumRecord[]> {
    return this.db.albums.where('artistId').equals(artistId).sortBy('album')
  }

  public async getTracksByAlbumId(albumId: string): Promise<ITrackRecord[]> {
    return this.db.tracks.where('albumId').equals(albumId).toArray()
  }

  public async hasData(): Promise<boolean> {
    const [artists, albums, tracks] = await Promise.all([
      this.db.artists.count(),
      this.db.albums.count(),
      this.db.tracks.count(),
    ])

    return artists + albums + tracks > 0
  }

  public async clear(): Promise<void> {
    return this.db.transaction('rw?', [this.db.artists, this.db.albums, this.db.tracks], async () => {
      await this.db.artists.clear()
      await this.db.albums.clear()
      await this.db.tracks.clear()
    })
  }
}
