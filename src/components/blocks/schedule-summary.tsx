import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ScheduleAction = 'accept' | 'pending' | 'refuse'
/** Visual summary only; the caller supplies display strings and response handling. */
export function ScheduleSummary({ title, timeLabel, organizer, participants, onAction }: {
  title: string; timeLabel: string; organizer: string; participants: string
  onAction?: (action: ScheduleAction) => void
}) {
  return <div className="overflow-hidden rounded-xl border bg-card">
    <div className="bg-schedule-background p-4" style={{backgroundImage:'linear-gradient(90deg, rgb(140 196 66 / 14%), transparent), linear-gradient(rgb(255 255 255 / 65%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 65%) 1px, transparent 1px)',backgroundSize:'100% 100%, 22px 22px, 22px 22px'}}><p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays size={14}/>日程摘要样本</p><h3 className="text-sm font-medium">{title}</h3><p className="mt-1 text-xs">{timeLabel}</p></div>
    <div className="p-4"><dl className="space-y-2 text-xs"><div className="flex gap-4"><dt className="w-16 shrink-0 text-muted-foreground">组织者</dt><dd className="min-w-0 truncate">{organizer}</dd></div><div className="flex gap-4"><dt className="w-16 shrink-0 text-muted-foreground">参与者</dt><dd className="min-w-0 truncate">{participants}</dd></div></dl><div className="mt-3 grid grid-cols-3 gap-2"><Button variant="outline" className="h-[var(--button-height)] rounded-[var(--button-radius)] border-brand-green px-2 text-micro text-action-outline-text" disabled={!onAction} onClick={()=>onAction?.('accept')}>接受样本</Button><Button variant="outline" className="h-[var(--button-height)] rounded-[var(--button-radius)] bg-muted/50 px-2 text-micro font-normal" disabled={!onAction} onClick={()=>onAction?.('pending')}>待定样本</Button><Button variant="outline" className="h-[var(--button-height)] rounded-[var(--button-radius)] bg-muted/50 px-2 text-micro font-normal text-status-attention-text" disabled={!onAction} onClick={()=>onAction?.('refuse')}>拒绝样本</Button></div></div>
  </div>
}
