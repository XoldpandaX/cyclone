import type { AppDb } from '@/app/db'
import type { ITrackRecord } from '@/shared/types/record'
import type { IPlaylistItemDTO, IPlaylistRecord } from '@/shared/types/record/playlist'
import type { IPlaylistRepository } from '@/shared/types/repositories/playlist'
import { indexBy } from '@/shared/lib/array'
import { createPlaylistDto, createPlaylistItemRecord } from '../factories/playlist'

export class PlaylistRepository implements IPlaylistRepository {
  constructor(private readonly db: AppDb) {}

  public async getPlaylists(): Promise<IPlaylistRecord[]> {
    return this.db.playlists.toCollection().toArray()
  }

  public async getItems(playlistId: string): Promise<IPlaylistItemDTO[]> {
    const playlistItems = await this.db.playlistItems.where('playlistId').equals(playlistId).sortBy('order')
    if (!playlistItems.length) return []

    const playlistTracks = await this.db.tracks.bulkGet(playlistItems.map(({ trackId }) => trackId))
    const tracksById = indexBy(
      playlistTracks.filter((track): track is ITrackRecord => track !== undefined),
      (track) => track.id,
    )

    return playlistItems.map((item) => createPlaylistDto(item, tracksById[item.trackId]!))
  }

  public async appendItems(playlistId: string, trackIds: string[]): Promise<IPlaylistItemDTO[]> {
    const newItemRecords = trackIds.map((trackId, index) => createPlaylistItemRecord({ playlistId, trackId, order: index }))
    await this.db.playlistItems.bulkAdd(newItemRecords)
    return this.getItems(playlistId)
  }

  public async removeItems(playlistId: string, playlistItemIds: string[]): Promise<IPlaylistItemDTO[]> {
    const itemsToRemove = playlistItemIds.map((trackId) => trackId)
    await this.db.playlistItems
      .where('id')
      .anyOf(itemsToRemove)
      .and((item) => item.playlistId === playlistId)
      .delete()

    return this.getItems(playlistId)
  }
}
