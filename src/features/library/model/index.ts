import type { ILibraryState } from './library-store'
import { useLibraryStore } from './library-store'
import { selectGetArtists } from './library-store-selectors.ts'

interface ILibraryPublicApi {
  getArtists: () => void
}

function toPublicApi(s: ILibraryState): ILibraryPublicApi {
  return {
    getArtists: selectGetArtists(s),
  }
}

export { initLibrary } from './library-store'
export const useLibrary = <T>(selector: (s: ILibraryPublicApi) => T): T => {
  return useLibraryStore((s: ILibraryState): T => selector(toPublicApi(s)))
}
