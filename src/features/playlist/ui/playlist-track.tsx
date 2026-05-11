import type { FC } from 'react'
import type { ITrackRecord } from '@/shared/types/record'

interface IPlaylistTrackProps {
  track: ITrackRecord
  onRemoveClick: () => void
}

export const PlaylistTrack: FC<IPlaylistTrackProps> = ({ track, onRemoveClick }) => {
  return (
    <div>
      <div key={track.id}>{track.title}</div>
      <button type="button" onClick={() => onRemoveClick()}>
        -
      </button>
    </div>
  )
}
