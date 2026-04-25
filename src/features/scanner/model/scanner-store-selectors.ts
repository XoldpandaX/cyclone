import type { IScannerState, ScanStatus } from './scanner-store'

export const selectStatus = (s: IScannerState): ScanStatus => s.status

export const selectProgressPercentage = (s: IScannerState): number =>
  s.scanProgress ? (s.scanProgress.processed / s.scanProgress.total) * 100 : 0

export const selectProcessingFile = (s: IScannerState): string =>
  `${s.scanProgress.filePath}${s.scanProgress.fileName}`

export const selectSelectScanFolder = (s: IScannerState): (() => void) => s.selectScanFolder

export const selectRequestPermission = (s: IScannerState): (() => void) => s.requestPermission
