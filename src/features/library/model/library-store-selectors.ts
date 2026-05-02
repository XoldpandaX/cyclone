import type { ILibraryState } from './library-store'
import type { IAlbumRecord, IArtistRecord, ITrackRecord } from '@/shared/types/record'
import { createSelector } from 'reselect'

// interface ILibraryAlbum extends IAlbumRecord {
//   tracks: ITrackRecord[]
// }

// interface ILibraryArtist extends IArtistRecord {
//   albums: ILibraryAlbum[]
// }

// type Tree = ILibraryArtist[]

// export const selectTree = (s: ILibraryState): Tree => {
//   if (!s.artists) return []
//
//   const tree: Tree = []
//   for (const artist of s.artists) {
//     const artistAlbums = s.albums ? (s.albums[artist.id] ?? []) : []
//     tree.push({
//       ...artist,
//       albums: artistAlbums.map((album) => ({
//         ...album,
//         tracks: s.tracks ? (s.tracks[album.id] ?? []) : [],
//       })),
//     })
//   }
//
//   return tree
// }

export const selectGetArtists = (s: ILibraryState): (() => void) => s.getArtists

export const createTreeSelector = <TNode>(
  mapTrack: (track: ITrackRecord) => TNode,
  mapAlbum: (album: IAlbumRecord, tracks: TNode[]) => TNode,
  mapArtist: (artist: IArtistRecord, albums: TNode[]) => TNode,
) =>
  createSelector(
    (s: ILibraryState) => s.artists,
    (s: ILibraryState) => s.albums,
    (s: ILibraryState) => s.tracks,
    (artists, albums, tracks) => {
      if (!artists.length) return []

      return artists.map((artist) => {
        const artistAlbums = (albums?.[artist.id] ?? []).map((album) => {
          const albumTracks = (tracks?.[album.id] ?? []).map(mapTrack)
          return mapAlbum(album, albumTracks)
        })
        return mapArtist(artist, artistAlbums)
      })
    },
  )
