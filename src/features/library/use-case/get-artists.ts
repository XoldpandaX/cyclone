import type { IArtistRecord } from '@/shared/types/record'
import type { ILibraryRepository } from '@/shared/types/repositories/library.ts'

export const getArtistsUseCase = async (libraryRepository: ILibraryRepository): Promise<IArtistRecord[]> => {
  try {
    const artists = await libraryRepository.getArtists()
    return artists
  } catch (e) {
    console.error(e)
    throw new Error('getArtistsUseCase')
  }
}
