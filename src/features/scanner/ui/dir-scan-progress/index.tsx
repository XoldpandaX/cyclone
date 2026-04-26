import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { formatNum } from '@/shared/lib/formatters'
import { CProgress, CStatusDot, CText } from '@/shared/ui-kit'
import { useScanner } from '../../model'

import styles from './dir-scan-progress.module.scss'

export function DirScanProgress() {
  const { t } = useTranslation('scanner')
  const processedFilesTotal = useScanner((s) => s.processedFilesTotal)
  const progressPercentage = useScanner((s) => s.progressPercentage)
  const processingFile = useScanner((s) => s.processingFile)
  const status = useScanner((s) => s.status)
  const isReady = status === 'ready'

  const isProcessing = status === 'processing'
  if (!isProcessing && !isReady) return null

  return (
    <div className={styles.dirScanProgress}>
      {progressStatus(isReady, t)}
      {!isReady && (
        <>
          <CProgress
            className={styles.dirScanProgressProgressLine}
            value={progressPercentage}
            color="green"
            hasLabel
          />
          <CText className={styles.dirScanCurrentProcessingFile} c="dark" truncate="end" mono>
            {t('processing', { file: processingFile })}
          </CText>
        </>
      )}

      <CText size="xs" mono>
        {t('tracksIndexed', { count: formatNum(processedFilesTotal) })}
      </CText>
    </div>
  )
}

function progressStatus(isReady: boolean, t: (key: string) => string): ReactElement {
  return (
    <div className={styles.dirScanProgressStatus}>
      <CStatusDot color="green" active={!isReady} />
      {!isReady && <CText mono>{t('status.scanning')}</CText>}
    </div>
  )
}
