import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import type { ITrackRepository } from '@/shared/types/repositories/track'
import { AppDb } from '@/app/db'
import { FsHandleRepository } from '@/app/repositories/fs-handle'
import { TrackRepository } from '@/app/repositories/track'
import { initScanner } from '@/features/scanner'

export interface IBootstrap {
  trackRepository: ITrackRepository
  fsHandleRepository: IFsHandleRepository
}

export const bootstrap = async (): Promise<IBootstrap> => {
  const db = new AppDb()
  const trackRepository = new TrackRepository(db.tracks)
  const fsHandleRepository = new FsHandleRepository(db.handles)

  await initScanner({
    trackRepository,
    fsHandleRepository,
  })

  return {
    trackRepository,
    fsHandleRepository,
  }
}
