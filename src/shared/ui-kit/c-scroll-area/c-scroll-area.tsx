import type { ScrollAreaProps } from '@mantine/core'
import { ScrollArea } from '@mantine/core'

interface ICScrollAreaProps extends Omit<ScrollAreaProps, 'type' | 'scrollbarSize' | 'scrollHideDelay'> {}

export const CScrollArea = (props: ICScrollAreaProps) => (
  <ScrollArea type="hover" scrollbarSize={6} scrollHideDelay={0} {...props} />
)

// https://mantine.dev/core/scroll-area/
