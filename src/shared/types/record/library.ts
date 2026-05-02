import type { Nullable } from '@/shared/types/maybe'

export interface IArtistRecord {
  id: string
  artist: string
}

export interface IAlbumRecord {
  id: string
  artistId: string
  album: string
  cover: string
}

export interface ITrackRecord {
  id: string
  artistId: string
  albumId: string
  fileName: string
  pathSegments: string[]
  mimeType: string
  title: string
  album: string
  albumArtist: string
  artist: string
  year: Nullable<number>
  duration: Nullable<number>
  no: Nullable<number>
  of: Nullable<number>
}
