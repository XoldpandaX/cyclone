import type { FC, PropsWithChildren } from 'react'
import { MantineProvider } from '@mantine/core'
import { theme } from './theme'

import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'

interface IUiProviderProps extends PropsWithChildren {}

export const UiProvider: FC<IUiProviderProps> = ({ children }) => {
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      {children}
    </MantineProvider>
  )
}
