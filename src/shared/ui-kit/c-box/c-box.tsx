import type { PropsWithChildren } from 'react'
import { Box, type BoxProps } from '@mantine/core'

export interface ICBoxPros extends BoxProps, PropsWithChildren {}

export const CBox = (props: ICBoxPros) => <Box {...props} />
