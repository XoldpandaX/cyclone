import type { FC } from 'react'
import { AppShell } from '@mantine/core'
import { DirScanner } from '@/features/scanner'
import { MusicPage } from '@/pages/MusicPage/music-page'

export const LayoutMain: FC = () => {
  return (
    <AppShell.Main>
      <>
        <DirScanner />
        <MusicPage />
      </>
    </AppShell.Main>
  )
}
