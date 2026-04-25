import type { IScannerState, ScanStatus } from './scanner-store'
import { useScannerStore } from './scanner-store'
import {
  selectProcessingFile,
  selectProgressPercentage,
  selectRequestPermission,
  selectSelectScanFolder,
  selectStatus,
} from './scanner-store-selectors'

interface IScannerPublicApi {
  status: ScanStatus
  progressPercentage: number
  processingFile: string
  selectScanFolder: () => void
  requestPermission: () => void
}

function toPublicApi(s: IScannerState): IScannerPublicApi {
  return {
    status: selectStatus(s),
    progressPercentage: selectProgressPercentage(s),
    processingFile: selectProcessingFile(s),
    selectScanFolder: selectSelectScanFolder(s),
    requestPermission: selectRequestPermission(s),
  }
}

export { initScanner } from './scanner-store'
export type { ScanStatus } from './scanner-store'

export function useScanner<T>(selector: (s: IScannerPublicApi) => T): T {
  return useScannerStore((s: IScannerState): T => selector(toPublicApi(s)))
}
