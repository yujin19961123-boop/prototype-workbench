// Adapted from teleMail/src/components/system/async-state.tsx.
import { Inbox, CircleAlert, SearchX } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export type AsyncStateKind = 'loading' | 'empty' | 'error' | 'noResults'
const defaultMessages = {
  loading: '正在加载', empty: '暂无内容', error: '加载失败，请稍后重试', noResults: '没有匹配的结果', retry: '重试',
}

/** Presentation only: the consumer owns request state and retry behavior. */
export function AsyncState({ kind, onRetry, messages }: {
  kind: AsyncStateKind
  onRetry?: () => void
  messages?: Partial<typeof defaultMessages>
}) {
  const text = { ...defaultMessages, ...messages }
  if (kind === 'loading') return (
    <div className="space-y-4 p-6" role="status" aria-label={text.loading}>
      <Skeleton className="h-4 w-1/2"/><Skeleton className="h-16 w-full"/><Skeleton className="h-16 w-full"/>
    </div>
  )
  const Icon = kind === 'error' ? CircleAlert : kind === 'noResults' ? SearchX : Inbox
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className="flex flex-col items-center gap-4 px-6 py-10 text-center">
      <Icon className="size-7 text-muted-foreground" aria-hidden="true"/>
      <p className="text-sm text-muted-foreground">{text[kind]}</p>
      {kind === 'error' && onRetry && <Button variant="outline" className="h-[var(--button-height)] rounded-[var(--button-radius)]" onClick={onRetry}>{text.retry}</Button>}
    </div>
  )
}
