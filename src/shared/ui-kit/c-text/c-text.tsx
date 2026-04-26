import type { PropsWithChildren } from 'react'
import { Text, type TextProps } from '@mantine/core'

export interface ICTextProps
  extends Omit<TextProps, 'style' | 'ff' | 'gradient'>, PropsWithChildren {
  mono?: boolean
}

export const CText = ({ mono, size, ...restProps }: ICTextProps) => (
  <Text ff={mono ? 'monospace' : undefined} size={size ?? 'sm'} {...restProps} />
)
