import type { MantineSize } from '@mantine/core'
import type { FC } from 'react'
import type { ServiceColor } from '../types.ts'
import { clsx } from 'clsx'

import { pulseAnimation } from '../animations'
import styles from './c-status-dot.module.scss'

type CStatusDotSize = Extract<MantineSize, 'xs' | 'sm'>

export interface ICStatusDot {
  color: ServiceColor
  size?: CStatusDotSize
  active?: boolean
}

export const CStatusDot: FC<ICStatusDot> = ({ color, size = 'xs', active }) => {
  return (
    <div
      className={clsx(
        styles['c-status-dot'],
        styles[`c-status-dot--${size ?? 'xs'}`],
        styles[`c-status-dot--${color}`],
        active && pulseAnimation.pulse,
      )}
    />
  )
}
