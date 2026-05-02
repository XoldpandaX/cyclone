import type { ITrackRecord } from '@/shared/types/record'
import type { ILibraryRepository } from '@/shared/types/repositories/library.ts'

export const getTracksByAlbumIdIdUseCase = async (
  albumId: string,
  {
    libraryRepository,
  }: {
    libraryRepository: ILibraryRepository
  },
): Promise<ITrackRecord[]> => {
  try {
    const tracks = await libraryRepository.getTracksByAlbumId(albumId)
    return tracks
  } catch (e) {
    console.error(e)
    throw new Error('getTracksByAlbumIdIdUseCase')
  }
}
