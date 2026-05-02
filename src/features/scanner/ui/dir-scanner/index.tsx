import { useScanner } from '@/features/scanner'
import { DirScannerSelectBtn } from './dir-scanner-select-btn'

export function DirScanner() {
  const status = useScanner((s) => s.status)

  if (status === 'ready') {
    return null
  }

  return <DirScannerSelectBtn />
}
