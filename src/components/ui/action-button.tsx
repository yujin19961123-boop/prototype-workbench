import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import "./action-button.css";

export function IconButton({ label, children, className, ...props }: Omit<ComponentProps<typeof Button>, "aria-label"> & { label: string }) {
  return <Button type="button" variant="ghost" size="icon-sm" {...props} aria-label={label} className={cn("product-icon-button", className)}>{children}</Button>;
}

export function CommandButton({ icon, children, orientation = "vertical", density = "default", className, ...props }: ComponentProps<typeof Button> & { icon?: ReactNode; orientation?: "vertical" | "horizontal"; density?: "default" | "comfortable" }) {
  return <Button type="button" variant="ghost" {...props} data-orientation={orientation} data-density={density} className={cn("product-command-button", className)}>{icon}{children}</Button>;
}

export function SplitButton({ children, onAction, onMenuAction, disabled, menuLabel = "更多操作", className }: { children: ReactNode; onAction?: () => void; onMenuAction?: () => void; disabled?: boolean; menuLabel?: string; className?: string }) {
  return <div className={cn("product-split-button", className)} role="group">
    <Button type="button" size="sm" disabled={disabled || !onAction} onClick={onAction}>{children}</Button>
    <Button type="button" size="icon-sm" disabled={disabled || !onMenuAction} onClick={onMenuAction} aria-label={menuLabel}><ChevronDown size={13}/></Button>
  </div>;
}
