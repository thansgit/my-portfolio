import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline'
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  icon?: ReactNode
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
}: ButtonProps) {
  // For the primary variant, use our utility class; for others, use inline Tailwind
  const variantStyles = {
    primary: 'button-primary',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100',
    outline: 'border border-zinc-700 hover:bg-zinc-800 text-zinc-200',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`/* [Base Button] Core button styling */ /* [Variant] Apply the selected variant style */ flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 disabled:opacity-70 ${variantStyles[variant]} /* [Custom] Any custom classes passed */ ${className} `}
    >
      {isLoading ? (
        <span className='mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
      ) : icon ? (
        <span className='mr-2'>{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
