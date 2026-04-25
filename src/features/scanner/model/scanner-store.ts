import type { IFsHandleRepository } from '@/shared/types/repositories/fs-handle'
import type { ITrackRepository } from '@/shared/types/repositories/track'
import { createStore, type StoreApi, useStore } from 'zustand'
import { initScan } from '../use-case/init-scan'
import { openScanFolder } from '../use-case/open-scan-folder'
import { requestDirPermission } from '../use-case/request-dir-permission'
import { runScanUseCase } from '../use-case/run-scan'

export type ScanStatus =
  /** Initial state, nothing has happened yet */
  | 'idle'
  /** Loading saved handle and tracks from DB */
  | 'initializing'
  /** Scanning directory and parsing audio metadata */
  | 'processing'
  /** folder found in DB but browser permission expired */
  | 'needs-permission'
  /** No folder found in DB */
  | 'no-folder'
  /** Scan complete, tracks are ready */
  | 'ready'
  /** Unrecoverable error occurred */
  | 'error'

export interface IScanProgress {
  total: number
  processed: number
  filePath: string
  fileName: string
}

export interface IScannerState {
  status: ScanStatus
  scanProgress: IScanProgress
  init: () => Promise<void>
  selectScanFolder: () => void
  requestPermission: () => void
  runScan: (dir: FileSystemDirectoryHandle) => Promise<void>
}

interface IScannerInitParams {
  trackRepository: ITrackRepository
  fsHandleRepository: IFsHandleRepository
}

// HMR resets module-level variables — preserve initParams across reloads so
// initScanner() doesn't need to be called again after a hot update
let initParams: IScannerInitParams | null = import.meta.hot?.data.initParams ?? null
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose((data) => {
    data.initParams = initParams
  })
}

const store: StoreApi<IScannerState> = createStore<IScannerState>()((set, get) => ({
  status: 'idle',
  scanProgress: {
    total: 0,
    processed: 0,
    filePath: '',
    fileName: '',
  },
  init: async (): Promise<void> => {
    try {
      set({ status: 'initializing' })

      const res = await initScan(getParams())
      if (res.status !== 'processing') {
        set({ status: res.status })
        return
      }

      await get().runScan(res.dir)
    } catch (e) {
      console.error(e)
    }
  },
  selectScanFolder: async (): Promise<void> => {
    try {
      const dir = await openScanFolder(getParams().fsHandleRepository)
      if (!dir) {
        return
      }

      get().runScan(dir)
    } catch (e) {
      console.error(e)
    }
  },
  requestPermission: async (): Promise<void> => {
    try {
      const dirWithGrantedPermission = await requestDirPermission(getParams().fsHandleRepository)
      if (!dirWithGrantedPermission) return

      get().runScan(dirWithGrantedPermission)
    } catch (e) {
      console.error(e)
    }
  },
  runScan: async (dir: FileSystemDirectoryHandle): Promise<void> => {
    const onProgressChange = (scanProgress: IScanProgress): void => set({ scanProgress })
    const onStatusChange = (status: ScanStatus): void => set({ status })

    try {
      set({ status: 'processing' })
      runScanUseCase({
        dir,
        trackRepository: getParams().trackRepository,
        onProgressChange,
        onStatusChange,
      })
    } catch (e) {
      console.error(e)
    }
  },
}))

function getParams(): IScannerInitParams {
  if (!initParams) {
    throw new Error('Scanner module not initialized. Call initScanner() in bootstrap.')
  }

  return initParams
}

export const initScanner = async (params: IScannerInitParams): Promise<void> => {
  initParams = params
  await store.getState().init()
}

export function useScannerStore<T>(selector: (s: IScannerState) => T): T {
  return useStore(store, selector)
}
