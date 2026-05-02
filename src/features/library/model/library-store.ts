import type { Nullable } from '@/shared/types/maybe'
import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record'
import type { ILibraryRepository } from '@/shared/types/repositories/library'
import { createStore, type StoreApi, useStore } from 'zustand'
import { getAlbumsByArtistIdUseCase } from '../use-case/get-albums'
import { getArtistsUseCase } from '../use-case/get-artists'
import { getTracksByAlbumIdIdUseCase } from '../use-case/get-tracks.ts'

type ArtistId = string
type AlbumId = string

export interface ILibraryState {
  artists: IArtistRecord[]
  albums: Nullable<Record<ArtistId, IAlbumRecord[]>>
  tracks: Nullable<Record<AlbumId, ITrackRecord[]>>
  getArtists: () => Promise<void>
  getAlbumsByArtistId: (artistId: string) => void
  getTracksByAlbumId: (albumId: string) => void
}

interface ILibraryStoreInitParams {
  libraryRepository: ILibraryRepository
}

// HMR resets module-level variables — preserve initParams across reloads so
// initScanner() doesn't need to be called again after a hot update
let initParams: ILibraryStoreInitParams | null = import.meta.hot?.data.initParams ?? null
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose((data) => {
    data.initParams = initParams
  })
}

const store: StoreApi<ILibraryState> = createStore<ILibraryState>()((set) => ({
  artists: [],
  albums: null,
  tracks: null,
  getArtists: async (): Promise<void> => {
    try {
      const artists = await getArtistsUseCase(getParams().libraryRepository)
      set({ artists })
    } catch (e) {
      console.error(e)
    }
  },
  getAlbumsByArtistId: async (artistId: string): Promise<void> => {
    try {
      const albums = await getAlbumsByArtistIdUseCase(artistId, { libraryRepository: getParams().libraryRepository })
      set((state) => ({
        albums: {
          ...(state.albums ?? {}),
          [artistId]: albums,
        },
      }))
    } catch (e) {
      console.error(e)
    }
  },
  getTracksByAlbumId: async (albumId: string): Promise<void> => {
    try {
      const tracks = await getTracksByAlbumIdIdUseCase(albumId, { libraryRepository: getParams().libraryRepository })
      set((state) => ({
        tracks: {
          ...(state.tracks ?? {}),
          [albumId]: tracks,
        },
      }))
    } catch (e) {
      console.error(e)
    }
  },
}))

function getParams(): ILibraryStoreInitParams {
  if (!initParams) {
    throw new Error('Library module not initialized. Call initLibrary() in bootstrap.')
  }

  return initParams
}

export const initLibrary = async (params: ILibraryStoreInitParams): Promise<void> => {
  initParams = params
}

export function useLibraryStore<T>(selector: (s: ILibraryState) => T): T {
  return useStore(store, selector)
}
