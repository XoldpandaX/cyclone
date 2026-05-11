import type { IActivePlaylist } from '../domain/active-playlist'
import type { IPlaylistState } from './playlist-store'
import type { ITrackRecord } from '@/shared/types/record'
import type { IPlaylistItemDTO, IPlaylistRecord } from '@/shared/types/record/playlist'
import { usePlaylistStore } from './playlist-store'
import {
  selectActivePlaylist,
  selectAppendTracksToActivePlaylist,
  selectPlaylists,
  selectRemoveTracksFromActivePlaylist,
} from './playlist-store-selectors'

interface IPlaylistPublicApi {
  playlists: IPlaylistRecord[]
  activePlaylist: IActivePlaylist
  appendTracksToActivePlaylist: (tracks: ITrackRecord[]) => Promise<void>
  removeItemsFromActivePlaylist: (items: IPlaylistItemDTO[]) => Promise<void>
}

function toPublicApi(s: IPlaylistState): IPlaylistPublicApi {
  return {
    playlists: selectPlaylists(s),
    activePlaylist: selectActivePlaylist(s),
    appendTracksToActivePlaylist: selectAppendTracksToActivePlaylist(s),
    removeItemsFromActivePlaylist: selectRemoveTracksFromActivePlaylist(s),
  }
}

export { initPlaylist } from './playlist-store'

export function usePlaylist<T>(selector: (s: IPlaylistPublicApi) => T): T {
  return usePlaylistStore((s: IPlaylistState): T => selector(toPublicApi(s)))
}
