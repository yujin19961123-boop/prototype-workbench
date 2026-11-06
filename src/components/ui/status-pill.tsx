import { Badge } from './badge'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const tones = {
  attention: 'bg-status-attention-bg text-status-attention-text',
  success: 'bg-status-success-bg text-status-success-text',
  neutral: 'bg-status-neutral-bg text-status-neutral-text',
  info: 'bg-status-info-bg text-status-info-text',
}
/** Visual tone only. Business status names and mappings belong to the consumer. */
export function StatusPill({ tone = 'neutral', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <Badge className={cn('h-5 max-w-full rounded-full border-0 px-2 text-[10px] font-normal', tones[tone])}><span className="truncate">{children}</span></Badge>
}
