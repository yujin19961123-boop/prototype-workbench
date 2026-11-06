import type { ReactNode } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import "./list-detail-layout.css";

/** Slots are public layout boundaries; page code never targets a child component's internals. */
export function ListDetailLayout({ header, sidebar, list, detail, sidebarWidth = "264px" }: { header: ReactNode; sidebar: ReactNode; list: ReactNode; detail: ReactNode; sidebarWidth?: string }) {
  return <section className="product-list-detail" style={{ gridTemplateColumns: `${sidebarWidth} minmax(0,1fr)` }}>
    <header className="product-list-detail-header">{header}</header>
    <aside className="product-list-detail-sidebar">{sidebar}</aside>
    <ResizablePanelGroup orientation="horizontal" className="product-list-detail-main">
      <ResizablePanel defaultSize="300px" minSize="240px" maxSize="460px"><div className="product-list-detail-list">{list}</div></ResizablePanel>
      <ResizableHandle aria-label="调整列表宽度"/>
      <ResizablePanel minSize="320px"><div className="product-list-detail-content">{detail}</div></ResizablePanel>
    </ResizablePanelGroup>
  </section>;
}
