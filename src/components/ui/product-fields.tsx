import type { ComponentProps } from 'react'
import { Input } from './input'
import { Textarea } from './textarea'
import { SelectTrigger } from './select'
import { RadioGroupItem } from './radio-group'
import { cn } from '@/lib/utils'

const fieldStyle = 'h-[var(--form-control-height)] rounded-full border-field-border bg-card px-3 text-sm shadow-none focus-visible:ring-brand-green/40 read-only:bg-field-muted disabled:bg-field-muted'

export function ProductInput({ className, ...props }: ComponentProps<typeof Input>) {
  return <Input {...props} className={cn(fieldStyle, className)}/>
}
export function ProductSelectTrigger({ className, ...props }: ComponentProps<typeof SelectTrigger>) {
  return <SelectTrigger {...props} className={cn(fieldStyle, 'w-full data-[size=default]:h-[var(--form-control-height)]', className)}/>
}
export function ProductTextarea({ className, ...props }: ComponentProps<typeof Textarea>) {
  return <Textarea {...props} className={cn('min-h-24 rounded-[var(--textarea-radius)] border-field-border bg-card px-3 py-2 text-sm shadow-none focus-visible:ring-brand-green/40', className)}/>
}
export function ProductRadioItem({ className, ...props }: ComponentProps<typeof RadioGroupItem>) {
  return <RadioGroupItem {...props} className={cn('size-3.5 border-field-border text-brand-green shadow-none data-[state=checked]:border-brand-green data-[state=checked]:bg-brand-green [&_[data-slot=radio-group-indicator]>svg]:fill-white [&_[data-slot=radio-group-indicator]>svg]:text-white [&_[data-slot=radio-group-indicator]>svg]:size-1', className)}/>
}
