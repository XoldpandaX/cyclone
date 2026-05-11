import type { ITrackRecord } from '@/shared/types/record'
import { AppShell } from '@mantine/core'
import { type FC, useEffectEvent } from 'react'
import { useEffect } from 'react'
import { LibraryTree, useLibrary } from '@/features/library'
import { usePlaylist } from '@/features/playlist'
import { useScanner } from '@/features/scanner'

import { CScrollArea } from '@/shared/ui-kit'
import styles from './layout-sidebar.module.scss'

export const LayoutSidebar: FC = () => {
  const scannerStatus = useScanner((s) => s.status)
  const getLibraryArtists = useLibrary((s) => s.getArtists)
  const appendTracksToActivePlaylist = usePlaylist((s) => s.appendTracksToActivePlaylist)

  const onScannerReady = useEffectEvent(() => {
    getLibraryArtists()
  })

  // TODO: RM after audio-engine will be implemented
  const addTrackToPlaylist = async (track: ITrackRecord): Promise<void> => {
    await appendTracksToActivePlaylist([track])
    // const root = await fsHandleRepository.get()
    // if (!root) return
    //
    // const file = await getFile(root, track.pathSegments, track.fileName)
    // if (!file) return
    // await audioEngine.load(await file.arrayBuffer())
    // audioEngine.on('timeUpdate', (timeInSec: number) => {
    //   console.warn(timeInSec)
    // })
    // audioEngine.play()
  }

  useEffect(() => {
    onScannerReady()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerStatus])

  return (
    <AppShell.Navbar className={styles.layoutSidebar}>
      <AppShell.Section grow my="md" component={CScrollArea}>
        <LibraryTree onTrackSelected={addTrackToPlaylist} />
      </AppShell.Section>
    </AppShell.Navbar>
  )
}
