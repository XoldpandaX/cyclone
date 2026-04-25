import { AppShell } from '@mantine/core'
import { LAYOUT_FOOTER_HEIGHT } from './layout-constants'
import { LayoutStatusBar } from './layout-status-bar'

export const LayoutFooter = () => {
  return (
    <AppShell.Footer>
      <div
        style={{
          height: LAYOUT_FOOTER_HEIGHT,
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        player nav
      </div>
      <LayoutStatusBar />
    </AppShell.Footer>
  )
}
