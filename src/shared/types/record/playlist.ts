import type { ITrackRecord } from '@/shared/types/record/library'

export interface IPlaylistRecord {
  id: string
  name: string
}
export interface IPlaylistItemRecord {
  id: string
  playlistId: string
  trackId: string
  order: number
}

export interface IPlaylistItemDTO extends Omit<IPlaylistItemRecord, 'trackId'> {
  track: ITrackRecord
}
