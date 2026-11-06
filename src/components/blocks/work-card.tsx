import type { ReactNode } from 'react'
import { CheckCircle2, Circle, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

/** Presentational composition. No task completion, drag/drop, dates, or dependencies. */
export function WorkCard({ title, completed = false, emphasized = false, status, people, progress, details }: {
  title: string; completed?: boolean; emphasized?: boolean; status?: ReactNode; people?: ReactNode
  progress?: { value: number; label: string }; details?: ReactNode
}) {
  return <Card className={cn('gap-3 rounded-[var(--radius-work-card)] p-4 shadow-none', emphasized && 'border-t-4 border-t-dependency-accent shadow-sm')}>
    <div className="flex min-w-0 items-center gap-2">{completed ? <CheckCircle2 size={14} className="shrink-0 text-brand-green" aria-label="完成外观样本"/> : <Circle size={14} className="shrink-0 text-muted-foreground" aria-hidden="true"/>}<p className={cn('min-w-0 truncate text-sm', completed && 'text-muted-foreground line-through')} title={title}>{title}</p></div>
    {progress && <div className="flex items-center gap-2"><Progress aria-label="进度外观样本" value={progress.value} className="h-1 flex-1 bg-muted [&_[data-slot=progress-indicator]]:bg-brand-green"/><span className="text-micro text-muted-foreground">{progress.label}</span></div>}
    {details && <Collapsible><CollapsibleTrigger asChild><Button variant="ghost" size="sm" className="h-6 w-full justify-between px-0 text-metadata font-normal text-muted-foreground">展开属性样本<ChevronDown size={12}/></Button></CollapsibleTrigger><CollapsibleContent className="pt-2 text-xs">{details}</CollapsibleContent></Collapsible>}
    {(status || people) && <><Separator/><div className="flex items-center justify-between gap-2">{status}<span className="ml-auto">{people}</span></div></>}
  </Card>
}
