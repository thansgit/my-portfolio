import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeuIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'accent' | 'flat'
  pressed?: boolean

  /**
   * When provided, renders as an <a> tag instead of a button
   */
  href?: string

  /**
   * External link target
   */
  target?: string

  /**
   * External link rel attribute
   */
  rel?: string
}

/**
 * Circular button designed for icons
 * Can be rendered as a button or an anchor link
 */
export const NeuIconButton = forwardRef<HTMLButtonElement, NeuIconButtonProps>(
  (
    {
      className,
      icon,
      size = 'md',
      variant = 'default',
      pressed = false,
      href,
      target,
      rel = 'noopener noreferrer',
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'neu-icon-button-sm',
      md: 'neu-icon-button-md',
      lg: 'neu-icon-button-lg',
    }

    // Common classes for both button and anchor
    const commonClasses = cn(
      // Base styling
      'inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none',

      // Size
      sizeClasses[size],

      // Variants
      variant === 'default' && !pressed && 'neu-button',
      variant === 'default' && pressed && 'neu-button transform translate-y-1',
      variant === 'accent' && !pressed && 'neu-button neu-button-accent',
      variant === 'accent' && pressed && 'neu-button neu-button-accent transform translate-y-1',
      variant === 'flat' && 'bg-neu-surface text-neu-text hover:bg-neu-bgLight',

      // Custom class
      className,
    )

    // Render as anchor if href is provided
    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={commonClasses}
          tabIndex={0}
          aria-label={props['aria-label']}
        >
          {icon}
        </a>
      )
    }

    // Otherwise render as button
    return (
      <button ref={ref} className={commonClasses} {...props}>
        {icon}
      </button>
    )
  },
)

NeuIconButton.displayName = 'NeuIconButton'
