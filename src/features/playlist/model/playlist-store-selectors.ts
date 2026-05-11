import type { IActivePlaylist } from '../domain/active-playlist'
import type { IPlaylistState } from './playlist-store'
import type { IPlaylistRecord } from '@/shared/types/record/playlist'

export const selectPlaylists = (s: IPlaylistState): IPlaylistRecord[] => s.playlists

export const selectActivePlaylist = (s: IPlaylistState): IActivePlaylist => s.activePlaylist

export const selectAppendTracksToActivePlaylist = (s: IPlaylistState): IPlaylistState['appendTracksToActivePlaylist'] =>
  s.appendTracksToActivePlaylist

export const selectRemoveTracksFromActivePlaylist = (s: IPlaylistState): IPlaylistState['removeTracksFromActivePlaylist'] =>
  s.removeTracksFromActivePlaylist
