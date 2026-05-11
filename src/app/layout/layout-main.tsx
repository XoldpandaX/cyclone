import type { FC } from 'react'
import { AppShell } from '@mantine/core'
import { Playlist } from '@/features/playlist'
import { DirScanner } from '@/features/scanner'

export const LayoutMain: FC = () => {
  return (
    <AppShell.Main>
      <>
        <DirScanner />
        <Playlist />
      </>
    </AppShell.Main>
  )
}
