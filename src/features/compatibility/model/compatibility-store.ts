import { createStore, useStore } from 'zustand'
import { checkCompatibilityUseCase } from '../use-case/check-compatibility'

export type CheckStatus =
  /** Initial state, check not started */
  | 'idle'
  /** Check in progress */
  | 'checking'
  /** Browser supports all required APIs */
  | 'supported'
  /** Browser lacks required APIs */
  | 'unsupported'

export interface ICompatibilityState {
  checkStatus: CheckStatus
  isMobile: boolean
  check: () => void
}

const store = createStore<ICompatibilityState>()((set) => ({
  checkStatus: 'idle',
  isMobile: false,
  check: (): void => {
    set({ checkStatus: 'checking' })
    const { compatible, isMobile } = checkCompatibilityUseCase()
    set({ checkStatus: compatible ? 'supported' : 'unsupported', isMobile })
  },
}))

export const initCompatibility = (): void => {
  store.getState().check()
}

export const useCompatibilityStore = <T>(selector: (s: ICompatibilityState) => T): T => useStore(store, selector)
