import { useEffect, useState } from 'react'
import { AppContext } from './app-context'
import { AppProviders } from './app-providers'
import { bootstrap, type IBootstrap } from './bootstrap'
import { Layout } from './layout'

export function App() {
  const [ctx, setCtx] = useState<IBootstrap | null>(null)

  useEffect(() => {
    bootstrap().then(setCtx)
  }, [])

  return (
    <AppProviders>
      {ctx === null ? (
        <p>Loading...</p>
      ) : (
        <AppContext value={ctx}>
          <Layout />
        </AppContext>
      )}
    </AppProviders>
  )
}
