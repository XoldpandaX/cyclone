import type { IActivePlaylist } from '@/features/playlist/domain/active-playlist.ts'
import type { ITrackRecord } from '@/shared/types/record'
import type { IPlaylistRecord } from '@/shared/types/record/playlist.ts'
import type { IPlaylistRepository } from '@/shared/types/repositories/playlist.ts'
import { createActivePlaylist } from '@/features/playlist/domain/active-playlist.ts'

export const appendTracks = async (
  payload: {
    activePlaylist: IPlaylistRecord
    tracks: ITrackRecord[]
  },
  deps: { playlistRepository: IPlaylistRepository },
): Promise<IActivePlaylist> => {
  try {
    const updatedPlaylistItems = await deps.playlistRepository.appendItems(
      payload.activePlaylist.id,
      payload.tracks.map(({ id }) => id),
    )

    return createActivePlaylist(payload.activePlaylist, updatedPlaylistItems)
  } catch (e) {
    console.error(e, 'while appendTracks')
    throw e
  }
}
