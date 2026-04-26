import type { FC } from 'react'
import { AppShell } from '@mantine/core'
import { LocaleSwitcher } from '@/features/locale'

export const LayoutSidebar: FC = () => {
  return (
    <AppShell.Navbar p="md">
      <LocaleSwitcher />
    </AppShell.Navbar>
  )
}
