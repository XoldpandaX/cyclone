import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, className, ...props }: ButtonProps) {
  const cls = [styles['button'], className].filter(Boolean).join(' ')
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
