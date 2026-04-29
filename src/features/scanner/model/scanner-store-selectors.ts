import type { IScannerState, ScanStatus } from './scanner-store'

export const selectStatus = (s: IScannerState): ScanStatus => s.status

export const selectProcessedFilesTotal = (s: IScannerState): number => s.scanProgress.processed

export const selectProcessingFile = (s: IScannerState): string => `${s.scanProgress.filePath}${s.scanProgress.fileName}`

export const selectSelectScanFolder = (s: IScannerState): (() => void) => s.selectScanFolder

export const selectRequestPermission = (s: IScannerState): (() => void) => s.requestPermission
