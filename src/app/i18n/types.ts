import type commonEn from '../../../public/locales/en/common.json'
import type scannerEn from '../../../public/locales/en/scanner.json'

declare module 'i18next' {
  interface ICustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof commonEn
      scanner: typeof scannerEn
    }
  }
}
