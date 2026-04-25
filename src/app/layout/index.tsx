import type { FC } from 'react'
import { AppShell } from '@mantine/core'
import { LAYOUT_FOOTER_TOTAL_HEIGHT } from './layout-constants'
import { LayoutFooter } from './layout-footer'
import { LayoutHeader } from './layout-header'
import { LayoutMain } from './layout-main'
import { LayoutSidebar } from './layout-sidebar'

export const Layout: FC = () => {
  return (
    <AppShell
      header={{ height: 42 }}
      footer={{ height: LAYOUT_FOOTER_TOTAL_HEIGHT }}
      navbar={{ width: 269, breakpoint: 'sm' }}
      padding="md"
    >
      <LayoutHeader />
      <LayoutSidebar />
      <LayoutMain />
      <LayoutFooter />
    </AppShell>
  )
}
