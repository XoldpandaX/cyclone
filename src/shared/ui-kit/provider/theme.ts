import type { CSSVariablesResolver, MantineThemeOverride } from '@mantine/core'

import '@fontsource/sora/300.css'
import '@fontsource/sora/400.css'
import '@fontsource/sora/500.css'
import '@fontsource/sora/600.css'
import '@fontsource/dm-mono/300.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'

export const theme: MantineThemeOverride = {
  primaryColor: 'brand',
  primaryShade: 5,
  fontFamily: 'Sora, sans-serif',
  // How to use monospace in cmp's <Text ff="monospace">00:00</Text>
  fontFamilyMonospace: 'DM Mono, monospace',
  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
  },
  components: {
    Text: { defaultProps: { size: 'sm' } },
  },
  colors: {
    // https://mantine.dev/colors-generator/?color=c8a96e
    brand: [
      '#fef6e5', // 0 — subtle backgrounds
      '#f4ead7', // 1 — hover on light backgrounds
      '#e5d4b4', // 2 — light variant
      '#d5bc8e', // 3 — lighter variant
      '#c8a96e', // 4 — light hover state
      '#bf9c58', // 5 — base accent color
      '#bc954b', // 6 — hover state on buttons
      '#a5813c', // 7 — active/pressed state
      '#937332', // 8 — darker variant
      '#806225', // 9 — darkest, high contrast
    ],
    dark: [
      '#C9C9C9', // 0 — primary text
      '#b8b8b8', // 1 — subtle text, placeholders
      '#828282', // 2 — disabled text
      '#696969', // 3 — icons, secondary text
      '#424242', // 4 — borders
      '#3b3b3b', // 5 — hovered backgrounds, active states
      '#2e2e2e', // 6 — inputs, cards
      '#141518', // 7 — app background
      '#0e0f11', // 8 — paper, sidebar
      '#141414', // 9 — darkest surfaces
    ],
    green: [
      '#e9fef0',
      '#d6f9e2',
      '#acf1c4',
      '#7ee9a3',
      '#59e388',
      '#43df76',
      '#35dd6c',
      '#27c45b',
      '#1db954',
      '#009741',
    ],
  },
}

export const cssVariablesResolver: CSSVariablesResolver = (t) => ({
  variables: {},
  light: {},
  dark: {
    // Mantine defaults borders to dark.4 — shift to dark.6 for a subtler look in dark mode
    '--mantine-color-default-border': t.colors.dark[6],
    // AppShell ignores --mantine-color-default-border and has its own variable;
    // overridden here but global.css is also needed due to selector specificity
    '--app-shell-border-color': t.colors.dark[6],
  },
})
