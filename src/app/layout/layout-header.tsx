import { AppShell, Group } from '@mantine/core'
import { LocaleSwitcher } from '@/features/locale'

export const LayoutHeader = () => {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <LocaleSwitcher />
      </Group>
    </AppShell.Header>
  )
}
