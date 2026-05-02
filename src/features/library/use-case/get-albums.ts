import type { IAlbumRecord } from '@/shared/types/record'
import type { ILibraryRepository } from '@/shared/types/repositories/library.ts'

export const getAlbumsByArtistIdUseCase = async (
  artistId: string,
  {
    libraryRepository,
  }: {
    libraryRepository: ILibraryRepository
  },
): Promise<IAlbumRecord[]> => {
  try {
    const albums = await libraryRepository.getAlbumsByArtistId(artistId)
    return albums
  } catch (e) {
    console.error(e)
    throw new Error('getAlbumsByArtistIdUseCase')
  }
}
