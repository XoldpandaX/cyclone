import { Progress } from '@mantine/core'
import { useScanner } from '../model'

export function DirScannerProgress() {
  const progressPercentage = useScanner((s) => s.progressPercentage)
  const processingFile = useScanner((s) => s.processingFile)

  const progressLabel = `${progressPercentage.toFixed(2)}%`
  return (
    <div>
      {progressPercentage ? (
        <div style={{ position: 'relative' }}>
          <div>{processingFile}</div>
          <Progress.Root size="xl">
            <Progress.Section value={progressPercentage} />
          </Progress.Root>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 500,
              pointerEvents: 'none',
            }}
          >
            {progressLabel}
          </span>
        </div>
      ) : null}
    </div>
  )
}
