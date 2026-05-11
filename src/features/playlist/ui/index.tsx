import type { FC } from 'react'
import { usePlaylist } from '../model'
import { Playlist } from './playlist'

export const PlaylistRoot: FC = () => {
  const activePlaylist = usePlaylist((s) => s.activePlaylist)
  const removeItemsFromActivePlaylist = usePlaylist((s) => s.removeItemsFromActivePlaylist)

  return (
    <div>
      <Playlist playlist={activePlaylist} onRemoveTrackClick={removeItemsFromActivePlaylist} />
    </div>
  )
}
