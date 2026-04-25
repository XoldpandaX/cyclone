import type { Nullable } from '@/shared/types/maybe'

export interface ITrackRecord {
  id: string
  fileName: string
  pathSegments: string[]
  mimeType: string
  no: Nullable<number>
  album: Nullable<string>
  artist: Nullable<string>
  title: Nullable<string>
  year: Nullable<number>
  duration: Nullable<number>
}
