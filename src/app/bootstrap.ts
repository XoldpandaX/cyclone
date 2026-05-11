import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import type { ILibraryRepository } from '@/shared/types/repositories/library'
import type { IAudioEngine } from '@/shared/types/services/audio-engine.ts'
import { AppDb } from '@/app/db'
import { FsHandleRepository } from '@/app/repositories/fs-handle'
import { LibraryRepository } from '@/app/repositories/library.ts'
import { PlaylistRepository } from '@/app/repositories/playlist.ts'
import { initCompatibility } from '@/features/compatibility'
import { initLibrary } from '@/features/library'
import { initPlaylist } from '@/features/playlist'
import { initScanner } from '@/features/scanner'
import { AudioEngine } from '@/shared/lib/services'

export interface IBootstrap {
  libraryRepository: ILibraryRepository
  fsHandleRepository: IFsHandleRepository
  audioEngine: IAudioEngine
}

export const bootstrap = async (): Promise<IBootstrap> => {
  const db = new AppDb()
  await db.open()

  const audioEngine = new AudioEngine()

  const libraryRepository = new LibraryRepository(db)
  const fsHandleRepository = new FsHandleRepository(db)
  const playlistRepository = new PlaylistRepository(db)

  initCompatibility()
  await Promise.all([
    initScanner({
      libraryRepository,
      fsHandleRepository,
    }),
    initLibrary({ libraryRepository }),
    initPlaylist({ playlistRepository }),
  ])

  return {
    libraryRepository,
    fsHandleRepository,
    audioEngine,
  }
}
