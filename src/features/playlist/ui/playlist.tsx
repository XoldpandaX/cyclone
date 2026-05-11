import type { FC } from 'react'
import type { IActivePlaylist } from '../domain/active-playlist'
import type { IPlaylistItemDTO } from '@/shared/types/record/playlist'
import { PlaylistTrack } from './playlist-track'

interface IPlaylistProps {
  playlist: IActivePlaylist
  onRemoveTrackClick: (item: IPlaylistItemDTO[]) => void
}

export const Playlist: FC<IPlaylistProps> = ({ playlist, onRemoveTrackClick }) => {
  return (
    <div>
      <h2>{playlist.name}</h2>
      {playlist.items.map((item) => (
        <PlaylistTrack key={item.id} track={item.track} onRemoveClick={() => onRemoveTrackClick([item])} />
      ))}
    </div>
  )
}
