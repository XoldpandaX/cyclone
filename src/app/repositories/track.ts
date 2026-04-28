import type { Table } from '../db'
import type { Optional } from '@/shared/types/maybe'
import type { ITrackRecord } from '@/shared/types/record'
import type { ITrackRepository } from '@/shared/types/repositories/track.ts'

export class TrackRepository implements ITrackRepository {
  constructor(private readonly tracks: Table<ITrackRecord, string, ITrackRecord>) {}

  public getAll(): Promise<ITrackRecord[]> {
    return this.tracks.toArray()
  }

  public async getArtists(): Promise<string[]> {
    const albumArtists = await this.tracks.orderBy('albumArtist').uniqueKeys()
    return albumArtists.filter((k): k is string => k !== null)
  }

  public getById(id: string): Promise<Optional<ITrackRecord>> {
    return this.tracks.get(id)
  }

  public async bulkPut(tracks: ITrackRecord[]): Promise<void> {
    await this.tracks.bulkPut(tracks)
  }

  public async clear(): Promise<void> {
    await this.tracks.clear()
  }
}
