import { Paperclip, Image, Video } from 'lucide-react'

export function AttachmentCount({ kind = 'file', count }: { kind?: 'file' | 'image' | 'video'; count: number }) {
  const Icon = kind === 'image' ? Image : kind === 'video' ? Video : Paperclip
  const label = kind === 'image' ? '图片' : kind === 'video' ? '视频' : '附件'
  return <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-foreground" aria-label={`${label} ${count} 个`}><Icon size={12} aria-hidden="true"/>+{count}</span>
}
