import { Button } from '@/components/ui/button'

/** Controlled status surface; no timer, queue, or send operation. */
export function ActionStatus({ message, actionLabel, onAction }: {
  message: string
  actionLabel?: string
  onAction?: () => void
}) {
  return <div className="inline-flex items-center gap-4 rounded-md bg-feedback-background px-3 py-2 text-xs text-feedback-foreground shadow-md"><span role="status">{message}</span>{actionLabel && onAction && <Button variant="ghost" size="sm" className="h-6 rounded-sm px-1 text-brand-green hover:bg-white/10 hover:text-brand-green focus-visible:ring-white" onClick={onAction}>{actionLabel}</Button>}</div>
}
