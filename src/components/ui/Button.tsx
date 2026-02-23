import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string
  children: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles = {
  primary: 'btn-premium',
  secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
  outline: 'bg-transparent border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-all duration-300',
  ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 transition-colors',
  danger: 'bg-red-600 text-white hover:bg-red-700 transition-colors',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const styles = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    loading && 'opacity-75',
    className
  )

  if (href) {
    return (
      <Link href={href} className={styles}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <span className={cn(loading && 'opacity-0')}>{children}</span>
      </Link>
    )
  }

  return (
    <button
      className={styles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
    </button>
  )
}