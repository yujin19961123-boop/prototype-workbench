import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogClose = DialogPrimitive.Close
export function DialogContent({children,className,overlayClassName,showCloseButton=true,...props}:ComponentProps<typeof DialogPrimitive.Content> & {overlayClassName?:string;showCloseButton?:boolean}) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className={cn("fixed inset-0 z-[var(--layer-overlay)] bg-foreground/25",overlayClassName)}/><DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-[var(--layer-dialog)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-xl',className)} {...props}>{children}{showCloseButton && <DialogPrimitive.Close aria-label="关闭弹窗" className="absolute right-4 top-4 rounded p-1 text-muted-foreground hover:bg-muted focus-visible:outline-2"><X size={16}/></DialogPrimitive.Close>}</DialogPrimitive.Content></DialogPrimitive.Portal> }
