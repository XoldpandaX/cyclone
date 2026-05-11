import type { ITrackRecord } from '@/shared/types/record'
import type { IPlaylistItemDTO, IPlaylistItemRecord } from '@/shared/types/record/playlist'
import { uuid } from '@/shared/lib/crypto'

export const createPlaylistDto = (playlistItem: IPlaylistItemRecord, track: ITrackRecord): IPlaylistItemDTO => {
  const { trackId: _trackId, ...restPlaylistItem } = playlistItem

  return {
    ...restPlaylistItem,
    track,
  }
}

export const createPlaylistItemRecord = (data: {
  playlistId: string
  trackId: string
  order: number
}): IPlaylistItemRecord => ({
  id: uuid(),
  playlistId: data.playlistId,
  trackId: data.trackId,
  order: data.order,
})
