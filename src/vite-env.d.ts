/// <reference types="vite/client" />

// eslint-disable-next-line ts/naming-convention
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ENABLE_MOCK: string
}

// eslint-disable-next-line ts/naming-convention
interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}
