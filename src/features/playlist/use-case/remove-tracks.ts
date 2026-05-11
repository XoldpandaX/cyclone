import type { IActivePlaylist } from '@/features/playlist/domain/active-playlist.ts'
import type { IPlaylistItemDTO, IPlaylistRecord } from '@/shared/types/record/playlist.ts'
import type { IPlaylistRepository } from '@/shared/types/repositories/playlist.ts'
import { createActivePlaylist } from '@/features/playlist/domain/active-playlist.ts'

export const removeTracks = async (
  payload: {
    activePlaylist: IPlaylistRecord
    items: IPlaylistItemDTO[]
  },
  deps: { playlistRepository: IPlaylistRepository },
): Promise<IActivePlaylist> => {
  try {
    const updatedPlaylistItems = await deps.playlistRepository.removeItems(
      payload.activePlaylist.id,
      payload.items.map(({ id }) => id),
    )

    return createActivePlaylist(payload.activePlaylist, updatedPlaylistItems)
  } catch (e) {
    console.error(e, 'while removeTracks')
    throw e
  }
}
