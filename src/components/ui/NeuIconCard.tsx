import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { NeuContainer } from './NeuContainer'

interface NeuIconCardProps {
  title: string
  description: string
  icon: ReactNode
  className?: string
  pressed?: boolean
  onClick?: () => void
}

export function NeuIconCard({ title, description, icon, className = '', pressed = false, onClick }: NeuIconCardProps) {
  return (
    <NeuContainer
      className={cn('transition-all duration-300 hover:translate-y-[2px]', className)}
      variant={pressed ? 'pressed' : 'default'}
      onClick={onClick}
    >
      <div className='p-4'>
        <div className='flex items-start gap-4'>
          <div className={cn('mt-1 flex-shrink-0 rounded-full p-2', pressed ? 'bg-neu-bgDark' : 'neu-icon')}>
            {icon}
          </div>

          <div>
            <h3 className='text-neu-accent font-medium'>{title}</h3>
            <p className='text-neu-textSecondary mt-1 text-sm'>{description}</p>
          </div>
        </div>
      </div>
    </NeuContainer>
  )
}
