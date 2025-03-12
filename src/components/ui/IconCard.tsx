import { ReactNode } from 'react'
import { Card, CardContent } from './card'

interface IconCardProps {
  title: string
  description: string
  icon: ReactNode
  className?: string
}

export function IconCard({ title, description, icon, className = '' }: IconCardProps) {
  return (
    <Card className={`card-base ${className}`}>
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          {/* Icon container */}
          <div className='mt-1 flex-shrink-0'>{icon}</div>

          {/* Content */}
          <div>
            <h3 className='font-medium text-yellow-500'>{title}</h3>
            <p className='mt-1 text-sm text-zinc-300'>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
