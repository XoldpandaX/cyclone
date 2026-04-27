import type { Optional } from '@/shared/types/maybe'
import type { ITrackRecord } from '@/shared/types/record'

export interface ITrackRepository {
  getAll: () => Promise<ITrackRecord[]>
  getById: (id: string) => Promise<Optional<ITrackRecord>>
  bulkPut: (tracks: ITrackRecord[]) => Promise<void>
  clear: () => Promise<void>
}
