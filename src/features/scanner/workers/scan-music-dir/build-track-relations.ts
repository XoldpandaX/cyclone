import type { IFullRawTrackData, IMinimalRawTrackData } from './types'
import { uuid } from '@/shared/lib/crypto'

const VARIOUS_ARTISTS = 'Various Artists'
const UNKNOWN_ARTIST = 'Unknown Artist'
const UNKNOWN_ALBUM = 'Unknown Album'
const KEY_SEPARATOR = '\0'

export const buildTrackRelations = (tracks: IMinimalRawTrackData[]): IFullRawTrackData[] => {
  // Pass 1: detect compilations — group by directory + album (case-insensitive).
  // If multiple different artists are found within the same directory/album, it is considered a compilation.

  // Group tracks by path + album name
  const tracksByAlbum = new Map<string, IMinimalRawTrackData[]>()
  for (const track of tracks) {
    const key = getDirAlbumKey(track)

    if (!tracksByAlbum.has(key)) {
      tracksByAlbum.set(key, [])
    }

    tracksByAlbum.get(key)!.push(track)
  }

  // Detect compilation albums(where various artists in one album)
  const compilationAlbums = new Set<string>()
  for (const [album, tracks] of tracksByAlbum) {
    const artists = new Set(tracks.map((t) => t.meta.albumArtist || t.meta.artist || UNKNOWN_ARTIST))
    if (artists.size > 1) {
      compilationAlbums.add(album)
    }
  }

  const isTrackFromCompilationAlbum = (track: IMinimalRawTrackData): boolean => {
    const key = getDirAlbumKey(track)
    return compilationAlbums.has(key)
  }

  // Pass 2: group into final albums (case-insensitive album key).
  // Compilations → key by album + year only (no artist).
  // Normal albums → key by effective_albumartist + album + year.
  const tracksByAlbumFinal = new Map<string, IMinimalRawTrackData[]>()
  for (const track of tracks) {
    const { meta } = track
    const artist = isTrackFromCompilationAlbum(track) ? VARIOUS_ARTISTS : (meta.albumArtist ?? meta.artist ?? UNKNOWN_ARTIST)
    const artistKey = `${artist}\0${getAlbumKey(track)}\0${meta.year ?? ''}`

    if (!tracksByAlbumFinal.has(artistKey)) {
      tracksByAlbumFinal.set(artistKey, [])
    }

    tracksByAlbumFinal.get(artistKey)!.push(track)
  }

  const albumIdMap = new Map<string, string>()
  const getOrCreateAlbumId = (key: string): string => {
    if (!albumIdMap.has(key)) {
      albumIdMap.set(key, uuid())
    }

    return albumIdMap.get(key)!
  }

  const artistIdMap = new Map<string, string>()
  const getOrCreateArtistId = (name: string): string => {
    if (!artistIdMap.has(name)) artistIdMap.set(name, uuid())
    return artistIdMap.get(name)!
  }

  const result: IFullRawTrackData[] = []
  for (const [key, albumTracks] of tracksByAlbumFinal) {
    const artistName = key.split(KEY_SEPARATOR)[0]!
    const artistId = getOrCreateArtistId(artistName)
    const albumId = getOrCreateAlbumId(key)
    result.push(...albumTracks.map((track) => ({ ...track, albumId, artistId, uniqArtist: artistName })))
  }

  return result
}

function getDirAlbumKey(track: IMinimalRawTrackData): string {
  return `${track.pathSegments.join(KEY_SEPARATOR)}\0${(track.meta.album || UNKNOWN_ALBUM).toLowerCase()}`
}

function getAlbumKey(track: IMinimalRawTrackData): string {
  return (track.meta.album || UNKNOWN_ALBUM).toLowerCase()
}
