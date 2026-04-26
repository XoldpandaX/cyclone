import type { ReactNode } from 'react'
import { UiProvider } from '@/shared/ui-kit'

import './i18n/config'
import './i18n/types'

interface IProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: IProvidersProps) {
  return <UiProvider>{children}</UiProvider>
}
