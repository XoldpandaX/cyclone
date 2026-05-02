import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record/library.ts'

export interface ILibraryRepository {
  loadData: (data: { artists: IArtistRecord[]; albums: IAlbumRecord[]; tracks: ITrackRecord[] }) => Promise<void>
  getArtists: () => Promise<IArtistRecord[]>
  getAlbumsByArtistId: (artistId: string) => Promise<IAlbumRecord[]>
  getTracksByAlbumId: (albumId: string) => Promise<ITrackRecord[]>
  hasData: () => Promise<boolean>
  clear: () => Promise<void>
}
