import { X } from 'lucide-react'

export function RecipientChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return <span className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-sm bg-recipient-background px-2 py-1 text-xs text-action-outline-text"><span className="truncate" title={label}>{label}</span>{onRemove && <button type="button" aria-label={`移除 ${label}`} onClick={onRemove} className="shrink-0 rounded-sm p-0.5 hover:bg-selection focus-visible:outline-2 focus-visible:outline-foreground"><X size={12} aria-hidden="true"/></button>}</span>
}
