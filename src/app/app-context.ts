import type { IBootstrap } from './bootstrap'
import { createContext, useContext } from 'react'

export const AppContext = createContext<IBootstrap | null>(null)

export function useAppContext(): IBootstrap {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
