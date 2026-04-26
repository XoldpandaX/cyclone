import { Select } from '@mantine/core'
import { useTranslation } from 'react-i18next'

const LOCALES = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'ua', label: '🇺🇦 Українська' },
  { value: 'ru', label: '🇷🇺 Русский' },
]

export const LocaleSwitcher = () => {
  const { i18n } = useTranslation()

  const handleChange = (value: string | null) => {
    if (value) void i18n.changeLanguage(value)
  }

  return (
    <Select
      data={LOCALES}
      value={i18n.language}
      onChange={handleChange}
      w={160}
      allowDeselect={false}
    />
  )
}
