import { AppShell } from '@mantine/core'
import { LAYOUT_FOOTER_HEIGHT } from './layout-constants'
import styles from './layout-footer.module.scss'

import { LayoutStatusBar } from './layout-status-bar'

export const LayoutFooter = () => {
  return (
    <AppShell.Footer>
      <div className={styles.layoutFooter} style={{ height: LAYOUT_FOOTER_HEIGHT }}>
        footer
      </div>
      <LayoutStatusBar />
    </AppShell.Footer>
  )
}
