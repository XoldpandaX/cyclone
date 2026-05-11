import type { IPlaylistItemDTO, IPlaylistRecord } from '@/shared/types/record/playlist.ts'

export interface IPlaylistRepository {
  getPlaylists: () => Promise<IPlaylistRecord[]>
  // createPlaylist: () => Promise<IPlaylistRecord>
  // deletePlaylistById: (playlistId: string) => Promise<void>
  getItems: (playlistId: string) => Promise<IPlaylistItemDTO[]>
  appendItems: (playlistId: string, trackIds: string[]) => Promise<IPlaylistItemDTO[]>
  removeItems: (playlistId: string, trackIds: string[]) => Promise<IPlaylistItemDTO[]>
}
