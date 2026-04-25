import type { ReactNode } from 'react'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'

import '@/shared/i18n/config'
import '@/shared/i18n/types'

interface IProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: IProvidersProps) {
  return <MantineProvider>{children}</MantineProvider>
}
