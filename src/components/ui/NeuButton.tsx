import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * - default: Surface button with 3D effect
   * - accent: Accent colored button
   * - flat: Flat button without shadows
   */
  variant?: 'default' | 'accent' | 'flat'

  size?: 'sm' | 'md' | 'lg'
  pressed?: boolean
}

const NeuButton = forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ className, variant = 'default', size = 'md', pressed = false, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          // Base styling
          'rounded-neu-md relative font-medium transition-all duration-300 focus:outline-none',

          sizeClasses[size],

          variant === 'default' && !pressed && 'neu-button',
          variant === 'default' && pressed && 'neu-button translate-y-1 transform',
          variant === 'accent' && !pressed && 'neu-button neu-button-accent',
          variant === 'accent' && pressed && 'neu-button neu-button-accent translate-y-1 transform',
          variant === 'flat' && 'bg-neu-surface text-neu-text',

          // Custom class
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

NeuButton.displayName = 'NeuButton'

export { NeuButton }
