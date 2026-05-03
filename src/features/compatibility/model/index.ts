import type { ICompatibilityState } from './compatibility-store'
import { useCompatibilityStore } from './compatibility-store'
import { selectCheckStatus, selectIsMobile } from './compatibility-store-selectors'

interface ICompatibilityPublicApi {
  checkStatus: ReturnType<typeof selectCheckStatus>
  isMobile: ReturnType<typeof selectIsMobile>
}

const toPublicApi = (s: ICompatibilityState): ICompatibilityPublicApi => ({
  checkStatus: selectCheckStatus(s),
  isMobile: selectIsMobile(s),
})

export { initCompatibility } from './compatibility-store'
export type { CheckStatus } from './compatibility-store'

export const useCompatibility = <T>(selector: (s: ICompatibilityPublicApi) => T): T =>
  useCompatibilityStore((s: ICompatibilityState): T => selector(toPublicApi(s)))
