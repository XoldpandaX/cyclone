import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './button.module.scss'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, className, ...props }: IButtonProps) {
  const cls = [styles.button, className].filter(Boolean).join(' ')
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
