import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import type { ILibraryRepository } from '@/shared/types/repositories/library'
import { AppDb } from '@/app/db'
import { FsHandleRepository } from '@/app/repositories/fs-handle'
import { LibraryRepository } from '@/app/repositories/library.ts'
import { initCompatibility } from '@/features/compatibility'
import { initLibrary } from '@/features/library'
import { initScanner } from '@/features/scanner'

export interface IBootstrap {
  libraryRepository: ILibraryRepository
  fsHandleRepository: IFsHandleRepository
}

export const bootstrap = async (): Promise<IBootstrap> => {
  const db = new AppDb()
  await db.open()

  const libraryRepository = new LibraryRepository(db)
  const fsHandleRepository = new FsHandleRepository(db)

  initCompatibility()
  await Promise.all([
    initScanner({
      libraryRepository,
      fsHandleRepository,
    }),
    initLibrary({ libraryRepository }),
  ])

  return {
    libraryRepository,
    fsHandleRepository,
  }
}
