import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeuTimelineItemProps {
  title: string
  subtitle: string
  period: string
  children?: ReactNode
  icon?: ReactNode
}

export function NeuTimelineItem({ title, subtitle, period, children, icon }: NeuTimelineItemProps) {
  return (
    <div className='relative mb-8 pl-8'>
      {/* Timeline marker */}
      <div
        className={cn(
          'absolute left-[-8px] top-1 flex h-4 w-4 items-center justify-center rounded-full',
          'bg-neu-accent shadow-neu-flat-sm z-10',
        )}
      >
        {icon}
      </div>

      <h3 className='text-neu-accent text-lg font-medium'>{title}</h3>
      <p className='text-neu-textMuted mb-2 text-sm'>
        {subtitle} | <span className='italic'>{period}</span>
      </p>

      {children}
    </div>
  )
}

export function NeuTimeline({ children }: { children: ReactNode }) {
  return (
    <div className='relative'>
      {/* Continuous timeline line */}
      <div className='bg-neu-accent absolute bottom-0 left-0 top-3 w-px'></div>
      {children}
    </div>
  )
}
