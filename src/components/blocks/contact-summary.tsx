import { ChevronRight, Ellipsis } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

/** Matched state is provided by the consumer; this block never searches accounts. */
export function ContactSummary({ name, email, subtitle, matched, onPrimary, onSecondary, onMore }: {
  name: string; email: string; subtitle?: string; matched: boolean
  onPrimary?: () => void; onSecondary?: () => void; onMore?: () => void
}) {
  return <Card className="gap-0 rounded-[var(--radius-contact-summary)] border-0 p-4 shadow-[var(--shadow-float)]">
    <div className="flex min-w-0 items-start justify-between gap-4"><div className="min-w-0"><h3 className="truncate text-lg font-medium" title={name}>{name}</h3>{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}</div><div className="flex shrink-0 items-center gap-2"><Avatar className="size-12 rounded-lg"><AvatarFallback className="rounded-lg bg-field-muted text-muted-foreground">{name.slice(0,1)}</AvatarFallback></Avatar>{matched && <ChevronRight size={14} aria-hidden="true"/>}</div></div>
    <p className="mt-4 truncate text-xs text-muted-foreground" title={email}>{email}</p>
    <p className="mb-4 mt-4 text-xs text-muted-foreground">{matched ? '匹配到 IM 账号 · 样本状态' : '未匹配到 IM 账号 · 样本状态'}</p>
    <Separator/>
    <div className="mt-4 flex flex-wrap items-center gap-1.5"><Button className="h-[var(--button-height)] rounded-[var(--button-radius)] bg-brand-green px-3 text-micro font-medium text-white hover:bg-brand-green" disabled={!onPrimary} onClick={onPrimary}>{matched ? '添加到邮件联系人' : '撰写邮件'}</Button><Button variant="outline" className="h-[var(--button-height)] rounded-[var(--button-radius)] bg-muted/50 px-2 text-micro font-normal" disabled={!onSecondary} onClick={onSecondary}>{matched ? '撰写邮件' : '往来邮件'}</Button><Button variant="outline" size="icon" className="size-[var(--button-height)] rounded-[var(--button-radius)] bg-muted/50" aria-label={`${name} 的更多动作样本`} disabled={!onMore} onClick={onMore}><Ellipsis size={16}/></Button></div>
  </Card>
}
