import type { ReactNode } from 'react'

import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <MantineProvider>{children}</MantineProvider>
}
