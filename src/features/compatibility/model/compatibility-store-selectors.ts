import type { CheckStatus, ICompatibilityState } from './compatibility-store'

export const selectCheckStatus = (s: ICompatibilityState): CheckStatus => s.checkStatus
export const selectIsMobile = (s: ICompatibilityState): boolean => s.isMobile
