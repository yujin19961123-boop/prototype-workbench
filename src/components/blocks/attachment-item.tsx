import { FileText } from 'lucide-react'

/** File appearance only; opening a file requires an explicit consumer callback. */
export function AttachmentItem({ name, sizeLabel, onOpen }: { name: string; sizeLabel: string; onOpen?: () => void }) {
  const content = <><span className="grid size-8 shrink-0 place-items-center rounded bg-status-attention-bg text-status-attention-text"><FileText size={18} aria-hidden="true"/></span><span className="min-w-0"><span className="block truncate text-xs" title={name}>{name}</span><span className="block text-metadata text-muted-foreground">{sizeLabel}</span></span></>
  const className = 'flex w-full max-w-xs items-center gap-2 rounded-lg border bg-card p-2 text-left'
  return onOpen ? <button type="button" className={`${className} hover:bg-muted focus-visible:outline-2`} onClick={onOpen} aria-label={`打开附件 ${name}`}>{content}</button> : <div className={className}>{content}</div>
}
