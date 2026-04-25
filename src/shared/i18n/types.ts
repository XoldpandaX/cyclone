import type commonEn from '../../../public/locales/en/common.json'
import type usersEn from '../../../public/locales/en/users.json'

declare module 'i18next' {
  interface ICustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof commonEn
      users: typeof usersEn
    }
  }
}
