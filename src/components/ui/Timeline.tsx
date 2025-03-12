import { ReactNode } from 'react'

interface TimelineItemProps {
  title: string
  subtitle: string
  period: string
  children?: ReactNode
  icon?: ReactNode
}

export function TimelineItem({ title, subtitle, period, children, icon }: TimelineItemProps) {
  return (
    <div
      className={`/* [Timeline Item] Timeline entry with vertical line and marker */ relative mb-8 pl-8 before:absolute before:bottom-0 before:left-0 before:top-0 before:w-px before:bg-zinc-700`}
    >
      {/* Timeline marker/icon */}
      <div
        className={`/* [Timeline Marker] Yellow circle marker on the timeline */ absolute left-[-8px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500`}
      >
        {icon}
      </div>
      <h3 className='text-lg font-medium text-yellow-500'>{title}</h3>
      <p className='mb-2 text-sm text-zinc-400'>
        {subtitle} | <span className='italic'>{period}</span>
      </p>
      {children}
    </div>
  )
}

export function Timeline({ children }: { children: ReactNode }) {
  return <div className='relative'>{children}</div>
}
