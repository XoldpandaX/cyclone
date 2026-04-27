import type { FC, PropsWithChildren } from 'react'
import { MantineProvider } from '@mantine/core'
import { cssVariablesResolver, theme } from './theme'

import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import './global.css'

interface IUiProviderProps extends PropsWithChildren {}

export const UiProvider: FC<IUiProviderProps> = ({ children }) => {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      forceColorScheme="dark"
    >
      {children}
    </MantineProvider>
  )
}
