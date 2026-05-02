import type { Nullable } from '@/shared/types/maybe'

export interface ITrackMeta {
  title: Nullable<string>
  album: Nullable<string>
  albumArtist: Nullable<string>
  artist: Nullable<string>
  track: {
    no: Nullable<number>
    of: Nullable<number>
  }
  year: Nullable<number>
  duration: Nullable<number>
}

export interface IMinimalRawTrackData {
  id: string
  fileName: string
  pathSegments: string[]
  mimeType: string
  meta: ITrackMeta
}

export interface IFullRawTrackData extends IMinimalRawTrackData {
  albumId: string
  artistId: string
  uniqArtist: string
}
export interface IFileEntry {
  fileHandle: FileSystemFileHandle
  pathSegments: string[]
}

export type ScannerMessage =
  | { type: 'progress'; filePath: string; fileName: string; processed: number }
  | { type: 'done'; tracks: IFullRawTrackData[]; failed: Array<{ id: string; error: string }> }
  | { type: 'error'; message: string }
