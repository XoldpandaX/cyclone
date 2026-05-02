import { AppShell } from '@mantine/core'
import { type FC, useEffectEvent } from 'react'
import { useEffect } from 'react'
import { LibraryTree, useLibrary } from '@/features/library'
import { useScanner } from '@/features/scanner'

export const LayoutSidebar: FC = () => {
  const scannerStatus = useScanner((s) => s.status)
  const getLibraryArtists = useLibrary((s) => s.getArtists)

  const onScannerReady = useEffectEvent(() => {
    getLibraryArtists()
  })

  useEffect(() => {
    if (scannerStatus !== 'ready') return
    onScannerReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerStatus])

  return (
    <AppShell.Navbar p="sm">
      <LibraryTree />
    </AppShell.Navbar>
  )
}
