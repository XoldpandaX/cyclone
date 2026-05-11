import type { IActivePlaylist } from '../domain/active-playlist'
import type { ITrackRecord } from '@/shared/types/record'
import type { IPlaylistItemDTO, IPlaylistRecord } from '@/shared/types/record/playlist'
import type { IPlaylistRepository } from '@/shared/types/repositories/playlist'
import { createStore, type StoreApi, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { appendTracks } from '../use-case/append-tracks'
import { getActivePlaylist } from '../use-case/get-active-playlist.ts'
import { getPlaylists } from '../use-case/get-playlists'
import { removeTracks } from '../use-case/remove-tracks'

export interface IPlaylistState {
  playlists: IPlaylistRecord[]
  activePlaylist: IActivePlaylist
  getPlaylists: () => Promise<void>
  appendTracksToActivePlaylist: (tracks: ITrackRecord[]) => Promise<void>
  removeTracksFromActivePlaylist: (items: IPlaylistItemDTO[]) => Promise<void>
}

interface IPlaylistInitParams {
  playlistRepository: IPlaylistRepository
}

// HMR resets module-level variables — preserve initParams across reloads so
// initPlaylist() doesn't need to be called again after a hot update
let initParams: IPlaylistInitParams | null = import.meta.hot?.data.initParams ?? null
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose((data) => {
    data.initParams = initParams
  })
}

const store: StoreApi<IPlaylistState> = createStore<IPlaylistState>()(
  devtools(
    (set, get) => ({
      playlists: {},
      activePlaylist: {},

      // TODO: Add mechanism to save selected playlist, change it and operate by selected playlist
      appendTracksToActivePlaylist: async (newTracks: ITrackRecord[]): Promise<void> => {
        const updatedActivePlaylist = await appendTracks(
          { activePlaylist: get().activePlaylist, tracks: newTracks },
          { playlistRepository: getParams().playlistRepository },
        )

        set({ activePlaylist: updatedActivePlaylist }, false, 'appendTracksToActivePlaylist')
      },
      removeTracksFromActivePlaylist: async (itemsToRemove: IPlaylistItemDTO[]): Promise<void> => {
        const updatedActivePlaylist = await removeTracks(
          { activePlaylist: get().activePlaylist, items: itemsToRemove },
          { playlistRepository: getParams().playlistRepository },
        )

        set({ activePlaylist: updatedActivePlaylist }, false, 'removeTracksFromActivePlaylist')
      },
      getPlaylists: async (): Promise<void> => {
        const playlistRepository = getParams().playlistRepository

        const playlists = await getPlaylists({ playlistRepository })
        const activePlaylist = await getActivePlaylist({ playlist: playlists[0]! }, { playlistRepository })

        set({ playlists, activePlaylist }, false, 'getPlaylists')
      },
    }),
    { name: 'PlaylistStore', trace: true },
  ),
)

function getParams(): IPlaylistInitParams {
  if (!initParams) {
    throw new Error('Playlist module not initialized. Call initPlaylist() in bootstrap.')
  }

  return initParams
}

export const initPlaylist = async (params: IPlaylistInitParams): Promise<void> => {
  initParams = params
  await store.getState().getPlaylists()
}

export function usePlaylistStore<T>(selector: (s: IPlaylistState) => T): T {
  return useStore(store, selector)
}
