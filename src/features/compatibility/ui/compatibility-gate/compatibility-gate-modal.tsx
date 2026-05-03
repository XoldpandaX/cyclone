import { Modal, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { CText } from '@/shared/ui-kit'
import { useCompatibility } from '../../model'

interface ICompatibilityGateModalProps {
  opened: boolean
}

export const CompatibilityGateModal = ({ opened }: ICompatibilityGateModalProps) => {
  const { t } = useTranslation('compatibility')
  const isMobile = useCompatibility((s) => s.isMobile)

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
    >
      <Title order={4}>{t('title')}</Title>
      <CText mt="sm">{isMobile ? t('mobile') : t('desktop')}</CText>
    </Modal>
  )
}
