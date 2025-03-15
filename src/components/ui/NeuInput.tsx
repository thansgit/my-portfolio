import { forwardRef, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface NeuInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  pressed?: boolean
}

export const NeuInput = forwardRef<HTMLInputElement, NeuInputProps>(
  ({ className, label, error, helperText, icon, pressed = true, ...props }, ref) => {
    return (
      <div className='mb-4'>
        {label && <label className='text-neu-text mb-2 block text-sm font-medium'>{label}</label>}

        <div className='relative'>
          {icon && <div className='text-neu-textSecondary absolute left-3 top-1/2 -translate-y-1/2'>{icon}</div>}

          <input
            ref={ref}
            className={cn(
              'neu-input',
              pressed && 'shadow-neu-pressed-sm',
              icon && 'pl-10',
              error && 'border border-red-500',
              className,
            )}
            {...props}
          />
        </div>

        {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}

        {helperText && !error && <p className='text-neu-textMuted mt-1 text-xs'>{helperText}</p>}
      </div>
    )
  },
)

NeuInput.displayName = 'NeuInput'

interface NeuTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  pressed?: boolean
}

export const NeuTextarea = forwardRef<HTMLTextAreaElement, NeuTextareaProps>(
  ({ className, label, error, helperText, icon, pressed = true, ...props }, ref) => {
    return (
      <div className='mb-4'>
        {label && <label className='text-neu-text mb-2 block text-sm font-medium'>{label}</label>}

        <div className='relative'>
          {icon && <div className='text-neu-textSecondary absolute left-3 top-5'>{icon}</div>}

          <textarea
            ref={ref}
            className={cn(
              'neu-input min-h-[100px] resize-y',
              pressed && 'shadow-neu-pressed-sm',
              icon && 'pl-10',
              error && 'border border-red-500',
              className,
            )}
            {...props}
          />
        </div>

        {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}

        {helperText && !error && <p className='text-neu-textMuted mt-1 text-xs'>{helperText}</p>}
      </div>
    )
  },
)

NeuTextarea.displayName = 'NeuTextarea'
