import type { IActivePlaylist } from '@/features/playlist/domain/active-playlist.ts'
import type { IPlaylistRecord } from '@/shared/types/record/playlist.ts'
import type { IPlaylistRepository } from '@/shared/types/repositories/playlist.ts'
import { createActivePlaylist } from '@/features/playlist/domain/active-playlist.ts'

export const getActivePlaylist = async (
  payload: { playlist: IPlaylistRecord },
  service: { playlistRepository: IPlaylistRepository },
): Promise<IActivePlaylist> => {
  try {
    const activePlaylistItems = await service.playlistRepository.getItems(payload.playlist.id)
    return createActivePlaylist(payload.playlist, activePlaylistItems)
  } catch (e) {
    console.error(e, 'while getActivePlaylist')
    throw e
  }
}
