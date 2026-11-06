import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, ChevronRight, Eye, EyeOff, FilePenLine, LayoutGrid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrototypeAnnotation } from "./types";
import { useAnnotationTargets } from "./use-annotation-targets";
import "./annotations.css";

import { projectConfig } from "@/project.config";
const defaultStorageKey = `${projectConfig.id}.developer-annotations.v1`;

/** Workbench chrome, intentionally outside the product component catalog. */
export default function AnnotationWorkspace({ children, rules, page, frame, toolbarContent, active = true, storageKey = defaultStorageKey, designUrl = projectConfig.designUrl }: {
  children: ReactNode;
  toolbarContent?: ReactNode;
  rules: PrototypeAnnotation[];
  page: string;
  frame?: RefObject<HTMLIFrameElement | null>;
  active?: boolean; storageKey?: string; designUrl?: string;
}) {
  const [enabled, setEnabled] = useState(() => {
    try { return sessionStorage.getItem(storageKey) === "shown"; } catch { return false; }
  });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const headingId = useId(), drawerId = useId();
  const candidates = useMemo(() => rules.filter(rule => rule.pages.includes(page)), [rules, page]);
  const { targets, applicable } = useAnnotationTargets(candidates, canvas, frame);
  const current = useMemo(() => candidates.filter(rule => !rule.visibleWhen || applicable.has(rule.id)), [candidates, applicable]);
  const rule = current.find(item => item.id === selected);
  const activeTarget = rule && targets.get(rule.id);

  const close = useCallback(() => {
    setOpen(false); setSelected(null);
    if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
  }, []);
  useEffect(() => { if (open && active) closeButton.current?.focus({ preventScroll: true }); }, [open, active]);
  useEffect(() => { if (content.current) content.current.scrollTop = 0; }, [selected, open]);
  useEffect(() => { setOpen(false); setSelected(null); }, [page]);
  useEffect(() => { if (selected && !current.some(rule => rule.id === selected)) setSelected(null); }, [current, selected]);
  useEffect(() => {
    if (!open || !active) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault(); event.stopImmediatePropagation(); close();
    };
    // Iframe keyboard events do not bubble into the workbench document.
    let businessView: Window | null = null;
    const connect = () => {
      businessView?.removeEventListener("keydown", escape, true);
      // Capture at the iframe window before Radix's document listener can close a business modal.
      try { businessView = frame?.current?.contentDocument?.defaultView ?? null; } catch { businessView = null; }
      businessView?.addEventListener("keydown", escape, true);
    };
    const iframe = frame?.current;
    window.addEventListener("keydown", escape, true);
    iframe?.addEventListener("load", connect);
    connect();
    return () => {
      window.removeEventListener("keydown", escape, true);
      businessView?.removeEventListener("keydown", escape, true);
      iframe?.removeEventListener("load", connect);
    };
  }, [open, close, frame, active]);

  function rememberFocus() {
    if (open) return;
    let active = document.activeElement;
    try { const iframe = frame?.current; if (iframe && active === iframe) active = iframe.contentDocument?.activeElement ?? active; } catch { /* same-origin only */ }
    returnFocus.current = active as HTMLElement | null;
  }
  function show(id: string | null = null) {
    setSelected(id); setOpen(true);
  }
  function toggle() {
    setEnabled(value => {
      try { sessionStorage.setItem(storageKey, value ? "hidden" : "shown"); } catch { /* unavailable storage keeps the in-memory preference */ }
      return !value;
    });
  }
  function toggleButton() {
    const Icon = enabled ? EyeOff : Eye, label = enabled ? "隐藏标注" : "显示标注";
    return <Button type="button" variant="ghost" size="sm" className="pa-toggle" aria-pressed={enabled} aria-label={label} title={label} onClick={toggle}>
      <Icon aria-hidden="true"/><span>{label}</span>
    </Button>;
  }
  const status = (id: string) => targets.has(id) ? "当前可定位" : "当前未显示";

  return <div className="pa-workspace">
    <header className="pa-toolbar" data-prototype-annotations onPointerDownCapture={rememberFocus} onKeyDownCapture={event => { if (event.key === "Enter" || event.key === " ") rememberFocus(); }}>
      <a className="pa-home" href="/#overview" title="返回原型中心" aria-label="返回原型中心"><LayoutGrid aria-hidden="true"/><span>原型中心</span></a>
      <ChevronRight className="pa-breadcrumb" aria-hidden="true"/>
      <span className="pa-brand">开发标注</span>
      {toolbarContent}
      <div className="pa-toolbar-actions">
        <Button type="button" variant="outline" size="sm" className="pa-design-button" disabled={!designUrl} onClick={() => { if (designUrl) window.open(designUrl, "_blank", "noopener,noreferrer"); }} aria-label="查看 UI 设计稿"><FilePenLine aria-hidden="true"/><span>查看 UI 设计稿</span></Button>
        {toggleButton()}
        <Button type="button" size="sm" className="pa-rules-button" onClick={() => show()} aria-expanded={open} aria-controls={drawerId} aria-label={`查看本页规则，${current.length} 条`}><List aria-hidden="true"/><span>本页规则</span><span className="pa-count">{current.length}</span></Button>
      </div>
    </header>
    <div className="pa-body">
      <div className="pa-canvas" ref={canvas}>{children}</div>
      {open && <aside id={drawerId} className="pa-drawer" role="dialog" aria-modal="false" aria-labelledby={headingId} data-prototype-annotations>
        <header>
          {rule ? <button type="button" onClick={() => setSelected(null)}><ArrowLeft aria-hidden="true"/>本页规则</button> : null}
          {toggleButton()}
          <button type="button" className="pa-close" ref={closeButton} aria-label="关闭开发标注" title="关闭开发标注" onClick={close}><X aria-hidden="true"/></button>
        </header>
        <h2 id={headingId}>{rule ? `标注 ${rule.number} · ${rule.title}` : "本页规则"}</h2>
        <div className="pa-content" ref={content}>
          {rule ? <>
            <div className="pa-meta"><span>{rule.category}</span><strong data-status={rule.status}>{rule.status}</strong><span>{status(rule.id)}</span></div>
            {Object.entries(rule.sections).filter(([, value]) => value).map(([title, value]) => <section key={title}><h3>{title}</h3><p>{value}</p></section>)}
            <section className="pa-basis"><h3>规则依据</h3><p>{rule.basis}</p><code>{rule.id}</code></section>
          </> : current.length ? current.map(item => <button type="button" className="pa-rule" key={item.id} onClick={() => show(item.id)}>
            <span className="pa-number">{item.number}</span>
            <span><b>{item.title}</b><small>{item.category} · {item.status} · {status(item.id)}</small></span>
            <ChevronRight aria-hidden="true"/>
          </button>) : <p className="pa-empty">本页暂无标注</p>}
        </div>
      </aside>}
    </div>
    <div className="pa-overlay" data-prototype-annotations onPointerDownCapture={rememberFocus} onKeyDownCapture={event => { if (event.key === "Enter" || event.key === " ") rememberFocus(); }}>
      {enabled && current.map((item, index) => {
        const target = targets.get(item.id);
        if (!target) return null;
        const slot = current.slice(0, index).filter(other => targets.get(other.id)?.node === target.node).length;
        const bounds = canvas.current?.getBoundingClientRect();
        const left = Math.max(bounds?.left ?? 0, Math.min((bounds?.right ?? innerWidth) - 28, target.box.right - 12 - slot * 28));
        const top = Math.max(bounds?.top ?? 40, target.box.top - 13);
        return <button type="button" className="pa-pin" key={item.id} data-ann-rule={item.id} style={{ left, top }} aria-label={`标注 ${item.number}：${item.title}`} onClick={() => show(item.id)}>{item.number}</button>;
      })}
      {enabled && open && activeTarget && <div className="pa-highlight" aria-hidden="true" style={{ left: activeTarget.box.left, top: activeTarget.box.top, width: activeTarget.box.right - activeTarget.box.left, height: activeTarget.box.bottom - activeTarget.box.top }}/>}
    </div>
  </div>;
}
