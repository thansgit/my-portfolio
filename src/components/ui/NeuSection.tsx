import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { NeuSectionTitle } from './NeuSectionTitle'

interface NeuSectionProps {
  title: string
  children: ReactNode
  className?: string
  icon?: ReactNode
}

export function NeuSection({ title, children, className = '', icon }: NeuSectionProps) {
  return (
    <section className={cn('relative mb-12', className)}>
      <NeuSectionTitle withIcon={!!icon} icon={icon}>
        {title}
      </NeuSectionTitle>
      <div className='mt-8'>{children}</div>
    </section>
  )
}
