import type { IPlaylistRecord } from '@/shared/types/record/playlist.ts'
import type { IPlaylistRepository } from '@/shared/types/repositories/playlist.ts'

export const getPlaylists = async ({
  playlistRepository,
}: {
  playlistRepository: IPlaylistRepository
}): Promise<IPlaylistRecord[]> => {
  try {
    const playlists = await playlistRepository.getPlaylists()
    return playlists
  } catch (e) {
    console.error(e, 'while getPlaylists')
    throw e
  }
}
