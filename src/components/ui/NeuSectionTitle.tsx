import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeuSectionTitleProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: 'default' | 'accent' | 'light'

  /**
   * Creates space for an icon container even when no icon is provided
   */
  withIcon?: boolean
  icon?: ReactNode
  neumorphicText?: boolean
}

/**
 * Section Title component with optional icon and 3D text effect
 */
export const NeuSectionTitle = ({
  children,
  className,
  as: Component = 'h2',
  color = 'default',
  withIcon = false,
  icon,
  neumorphicText = true,
}: NeuSectionTitleProps) => {
  // Color class mapping
  const colorClasses = {
    default: 'text-neu-accent',
    accent: 'text-neu-accent',
    light: 'text-neu-text',
  }

  return (
    <div className={cn('neu-section-title', className)}>
      {withIcon && <div className='neu-icon'>{icon}</div>}
      <Component className={cn('text-2xl font-bold', colorClasses[color], neumorphicText && 'neu-text-3d')}>
        {children}
      </Component>
    </div>
  )
}
