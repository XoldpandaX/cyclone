import type { FC } from 'react'
import type { ServiceColor } from '../types.ts'
import { Progress, type ProgressRootProps } from '@mantine/core'
import { clsx } from 'clsx'
import { CText } from '../c-text/c-text'
import { serviceColor } from '../types.ts'

import styles from './c-progress.module.scss'

export interface ICProgressProps extends Omit<ProgressRootProps, 'radius' | 'style' | 'size'> {
  value: number
  color: ServiceColor
  hasLabel?: boolean
}

export const CProgress: FC<ICProgressProps> = ({ value, color, hasLabel, className, ...rest }) => {
  return (
    <div className={clsx(className, styles.cProgress)}>
      <Progress.Root className={styles.cProgressBar} radius="xs" {...rest} size="sm">
        <Progress.Section value={value} color={serviceColor[color]} />
      </Progress.Root>
      {hasLabel && (
        <CText className={styles.cProgressLabel} fw="600" mono>
          {value.toFixed(0)}%
        </CText>
      )}
    </div>
  )
}
