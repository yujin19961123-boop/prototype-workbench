import type { ComponentProps } from 'react'
import { Badge } from './badge'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'
import { cn } from '@/lib/utils'

export function CountBadge({ count }: { count: number }) {
  return <Badge className="h-4 min-w-5 rounded-full bg-notification px-1 text-[10px] leading-none text-notification-foreground" aria-label={`${count} 条通知`}>{count > 99 ? '99+' : count}</Badge>
}

export function LabelBadge({ children }: { children: React.ReactNode }) {
  return <Badge className="h-4 rounded-sm bg-tag px-2 py-0 text-[10px] font-normal text-tag-foreground">{children}</Badge>
}

export function FilterGroup(props: ComponentProps<typeof ToggleGroup>) {
  return <ToggleGroup {...props} spacing={2} className={cn('flex-wrap gap-2', props.className)} />
}

export function FilterItem(props: ComponentProps<typeof ToggleGroupItem>) {
  return <ToggleGroupItem {...props} className={cn('h-[var(--control-height)] rounded-full border border-border bg-card px-4 text-xs font-normal text-muted-foreground shadow-none data-[state=on]:border-selection-border data-[state=on]:bg-selection data-[state=on]:text-selection-foreground', props.className)} />
}
