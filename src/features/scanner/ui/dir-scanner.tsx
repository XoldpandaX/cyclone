import { DirScannerProgress } from './dir-scanner-progress'
import { DirScannerSelectBtn } from './dir-scanner-select-btn'

export function DirScanner() {
  return (
    <div>
      <DirScannerSelectBtn />
      <DirScannerProgress />
    </div>
  )
}
