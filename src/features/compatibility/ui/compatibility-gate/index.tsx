import type { PropsWithChildren } from 'react'
import { useCompatibility } from '../../model'
import { CompatibilityGateModal } from './compatibility-gate-modal'

interface ICompatibilityGateProps extends PropsWithChildren {}

export const CompatibilityGate = ({ children }: ICompatibilityGateProps) => {
  const checkStatus = useCompatibility((s) => s.checkStatus)

  return (
    <>
      {children}
      <CompatibilityGateModal opened={checkStatus === 'unsupported'} />
    </>
  )
}
