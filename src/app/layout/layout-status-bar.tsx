import { DirScanProgress } from '@/features/scanner'
import { LAYOUT_STATUS_BAR_HEIGHT } from './layout-constants'

import styles from './layout-status-bar.module.scss'

export const LayoutStatusBar = () => {
  return (
    <div className={styles.layoutStatusBar} style={{ height: LAYOUT_STATUS_BAR_HEIGHT }}>
      <DirScanProgress />
    </div>
  )
}
