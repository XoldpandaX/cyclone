import type { IAudioMetadata } from 'music-metadata'
import type { ITrackRecord } from '@/shared/types/record'
import { orNull } from '@/shared/lib/maybe'

const createTrackRecord = (
  id: string,
  fileName: string,
  pathSegments: string[],
  mimeType: string,
  { common, format }: IAudioMetadata,
): ITrackRecord => {
  return {
    id,
    fileName,
    pathSegments,
    mimeType,
    no: common.track.no,
    artist: orNull(common.artist),
    albumArtist: null,
    title: orNull(common.title),
    album: orNull(common.album),
    year: orNull(common.year),
    duration: orNull(format.duration),
  }
}

export default createTrackRecord
