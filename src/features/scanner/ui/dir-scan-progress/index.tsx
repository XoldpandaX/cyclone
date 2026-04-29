import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { formatNum } from '@/shared/lib/formatters'
import { CStatusDot, CText } from '@/shared/ui-kit'
import { useScanner } from '../../model'

import styles from './dir-scan-progress.module.scss'

export function DirScanProgress() {
  const { t } = useTranslation('scanner')
  const processedFilesTotal = useScanner((s) => s.processedFilesTotal)
  const processingFile = useScanner((s) => s.processingFile)
  const status = useScanner((s) => s.status)
  const isReady = status === 'ready'

  const isProcessing = status === 'processing'
  if (!isProcessing && !isReady) return null

  const totalFiles = (): JSX.Element => {
    return (
      <CText className={styles.dirScanTracksCounter} size="xs" mono>
        {t('tracksIndexed', { count: formatNum(processedFilesTotal) })}
      </CText>
    )
  }

  return (
    <div className={styles.dirScanProgress}>
      <div className={styles.dirScanProgressStatus}>
        <CStatusDot color={isReady ? 'green' : 'yellow'} active={!isReady} />
        {isReady && totalFiles()}
        {!isReady && <CText mono>{t('status.scanning')}</CText>}
        {!isReady && (
          <CText className={styles.dirScanCurrentProcessingFile} c="dark" truncate="end" mono>
            {t('processing', { file: processingFile })}
          </CText>
        )}
      </div>
      {!isReady && totalFiles()}
    </div>
  )
}
