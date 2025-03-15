import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface NeuContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * - default: Raised container with 3D effect
   * - pressed: Inset/pressed container
   * - flat: Flat container without shadows
   */
  variant?: 'default' | 'pressed' | 'flat'

  withPadding?: boolean
}

/**
 * Versatile container component with 3D styling
 * Can be used for cards, panels, or any other container elements
 */
const NeuContainer = forwardRef<HTMLDivElement, NeuContainerProps>(
  ({ className, variant = 'default', withPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styling
          'rounded-neu-lg overflow-hidden',

          // Padding
          withPadding && 'p-6',

          variant === 'default' && 'neu-container',
          variant === 'pressed' && 'neu-container-pressed',
          variant === 'flat' && 'bg-neu-surface',

          // Custom class
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

NeuContainer.displayName = 'NeuContainer'

// Sub-components for better structure
const NeuContainerHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('px-6 py-4', className)} {...props} />,
)
NeuContainerHeader.displayName = 'NeuContainerHeader'

const NeuContainerBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
))
NeuContainerBody.displayName = 'NeuContainerBody'

const NeuContainerFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('mt-auto px-6 py-4', className)} {...props} />,
)
NeuContainerFooter.displayName = 'NeuContainerFooter'

export { NeuContainer, NeuContainerHeader, NeuContainerBody, NeuContainerFooter }
