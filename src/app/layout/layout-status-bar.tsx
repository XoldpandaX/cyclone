import { DirScanProgress } from '@/features/scanner'
import { LAYOUT_STATUS_BAR_HEIGHT } from './layout-constants'

export const LayoutStatusBar = () => {
  return (
    <div
      style={{
        height: LAYOUT_STATUS_BAR_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        paddingInline: 12,
        fontSize: 12,
      }}
    >
      <DirScanProgress />
    </div>
  )
}
