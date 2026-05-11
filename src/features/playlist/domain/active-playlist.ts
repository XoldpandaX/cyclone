import type { IPlaylistItemDTO, IPlaylistRecord } from '@/shared/types/record/playlist'

export interface IActivePlaylist extends IPlaylistRecord {
  items: IPlaylistItemDTO[]
}

export const createActivePlaylist = (playlist: IPlaylistRecord, items: IPlaylistItemDTO[]): IActivePlaylist => ({
  ...playlist,
  items,
})
