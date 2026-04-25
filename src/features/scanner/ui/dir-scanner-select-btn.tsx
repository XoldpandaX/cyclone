import { useShallow } from 'zustand/react/shallow'
import { useScanner } from '../model'

export function DirScannerSelectBtn() {
  const { status, selectScanFolder, requestPermission } = useScanner(
    useShallow((s) => ({
      status: s.status,
      selectScanFolder: s.selectScanFolder,
      requestPermission: s.requestPermission,
    })),
  )

  const handleClick = (): void => {
    if (status === 'no-folder') {
      selectScanFolder()
      return
    }

    if (status === 'needs-permission') {
      requestPermission()
    }
  }

  return (
    <button type="button" onClick={(): void => handleClick()}>
      {status !== 'needs-permission'
        ? 'Choose music folder'
        : 'Give permission to access music folder'}
    </button>
  )
}
