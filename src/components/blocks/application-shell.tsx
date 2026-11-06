import type { ComponentType, ReactNode } from "react";
import { LayoutGrid, Minus, MoreHorizontal, Square, UserRound, X } from "lucide-react";
import { IconButton } from "@/components/ui/action-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import "./application-shell.css";

export function ApplicationShell({ title, logo, items, activeId, onSelect, children }: {
  title: string;
  logo?: { src: string; alt: string };
  items: { id: string; label: string; icon: ComponentType<{ size?: number }>; disabled?: boolean }[];
  activeId: string;
  onSelect: (id: string) => void;
  children: ReactNode;
}) {
  return <TooltipProvider delayDuration={250}><div className="foundation-shell" data-prototype-app>
    <header className="foundation-windowbar" data-prototype-drag-handle>
      {logo ? <img src={logo.src} alt={logo.alt} draggable={false}/> : <strong>{title}</strong>}
      <div data-prototype-window-actions><IconButton label="最小化窗口" disabled><Minus size={16}/></IconButton><IconButton label="最大化窗口" disabled><Square size={13}/></IconButton><IconButton label="关闭窗口" disabled><X size={16}/></IconButton></div>
    </header>
    <nav className="foundation-app-rail" aria-label="应用侧边栏">
      <div className="foundation-apps">{items.map(({ id, label, icon: Icon, disabled }) => <Tooltip key={id}><TooltipTrigger asChild><IconButton label={label} className="foundation-app-button" data-active={id === activeId} aria-current={id === activeId ? "page" : undefined} disabled={disabled} onClick={() => { if (!disabled) onSelect(id); }}><Icon size={23}/></IconButton></TooltipTrigger><TooltipContent side="right">{label}</TooltipContent></Tooltip>)}</div>
      <div className="foundation-rail-bottom"><IconButton label="应用中心" disabled><LayoutGrid size={22}/></IconButton><IconButton label="更多应用" disabled><MoreHorizontal size={23}/></IconButton><IconButton label="个人资料" disabled><UserRound size={25}/></IconButton></div>
    </nav>
    <main className="foundation-app-content" aria-label={items.find(item => item.id === activeId)?.label ?? title}>{children}</main>
  </div></TooltipProvider>;
}
