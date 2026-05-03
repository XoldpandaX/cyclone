import { AppShell } from '@mantine/core'
import { LocaleSwitcher } from '@/features/locale'

export const LayoutHeader = () => {
  return (
    <AppShell.Header>
      <LocaleSwitcher />
    </AppShell.Header>
  )
}
