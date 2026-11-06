import { useEffect, useState, type RefObject } from "react";
import type { PrototypeAnnotation } from "./types";

export interface TargetBox { left: number; top: number; right: number; bottom: number }
export interface AnnotationTarget { node: Element; box: TargetBox }

function intersect(a: TargetBox, b: TargetBox): TargetBox {
  return { left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) };
}
function visibleBox(node: Element, document: Document): TargetBox | null {
  if (!node.isConnected || !node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return null;
  const view = document.defaultView!;
  let box = intersect(node.getBoundingClientRect(), { left: 0, top: 0, right: view.innerWidth, bottom: view.innerHeight });
  for (let p = node.parentElement; p; p = p.parentElement) {
    const style = view.getComputedStyle(p), rect = p.getBoundingClientRect();
    if (/auto|scroll|hidden|clip/.test(style.overflowX)) box = { ...box, left: Math.max(box.left, rect.left), right: Math.min(box.right, rect.right) };
    if (/auto|scroll|hidden|clip/.test(style.overflowY)) box = { ...box, top: Math.max(box.top, rect.top), bottom: Math.min(box.bottom, rect.bottom) };
  }
  return box.right - box.left >= 4 && box.bottom - box.top >= 4 ? box : null;
}

/** Watches the prototype document, including its scroll containers and iframe reloads. */
export function useAnnotationTargets(rules: PrototypeAnnotation[], canvas: RefObject<HTMLDivElement | null>, frame?: RefObject<HTMLIFrameElement | null>) {
  const [targets, setTargets] = useState<Map<string, AnnotationTarget>>(new Map());
  const [applicable, setApplicable] = useState<Set<string>>(new Set());
  useEffect(() => {
    let raf = 0, disposed = false, cleanupDocument = () => {};
    const host = canvas.current;
    if (!host) return;
    const scan = () => {
      raf = 0;
      if (disposed) return;
      const next = new Map<string, AnnotationTarget>();
      let doc: Document | null;
      try { doc = frame ? frame.current?.contentDocument ?? null : document; } catch { doc = null; }
      // Context membership is independent of viewport clipping and the pin visibility toggle.
      const scoped = rules.filter(rule => {
        if (!rule.visibleWhen) return true;
        try {
          return !!doc && [...doc.querySelectorAll(rule.visibleWhen)].some(node => node.checkVisibility({ checkVisibilityCSS: true }));
        } catch { return false; }
      });
      const ids = new Set(scoped.map(rule => rule.id));
      setApplicable(old => old.size === ids.size && [...ids].every(id => old.has(id)) ? old : ids);
      if (doc?.defaultView) {
        const iframe = frame?.current, viewport = host.getBoundingClientRect();
        let boundary = intersect(viewport, { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight });
        const frameBox = iframe?.getBoundingClientRect();
        const sx = iframe && frameBox ? frameBox.width / iframe.offsetWidth : 1;
        const sy = iframe && frameBox ? frameBox.height / iframe.offsetHeight : 1;
        const dx = frameBox ? frameBox.left + (iframe?.clientLeft ?? 0) * sx : 0;
        const dy = frameBox ? frameBox.top + (iframe?.clientTop ?? 0) * sy : 0;
        const clippedFrame = iframe ? visibleBox(iframe, document) : null;
        if (iframe && !clippedFrame) { setTargets(previous => previous.size ? new Map() : previous); return; }
        if (clippedFrame) boundary = intersect(boundary, clippedFrame);
        const modal = [...doc.querySelectorAll('[role="dialog"][aria-modal="true"], dialog[open]')].filter(n => visibleBox(n, doc!) && !n.closest('[data-prototype-annotations]')).at(-1);
        for (const rule of scoped) {
          if (!rule.selector) continue;
          let nodes: NodeListOf<Element>;
          try { nodes = doc.querySelectorAll(rule.selector); } catch { continue; }
          for (const node of nodes) {
            if (node.closest('[data-prototype-annotations]') || !iframe && !host.contains(node) || modal && !modal.contains(node)) continue;
            const local = visibleBox(node, doc);
            if (!local) continue;
            const box = intersect({ left: dx + local.left * sx, top: dy + local.top * sy, right: dx + local.right * sx, bottom: dy + local.bottom * sy }, boundary);
            if (box.right - box.left < 4 || box.bottom - box.top < 4) continue;
            // Hit test the clipped portion, excluding our own fixed overlay.
            const x = (box.left + box.right) / 2, y = (box.top + box.bottom) / 2;
            const hit = doc.elementsFromPoint((x - dx) / sx, (y - dy) / sy).find(n => !n.closest('[data-prototype-annotations]'));
            if (!hit || !(node.contains(hit) || hit.contains(node))) continue;
            next.set(rule.id, { node, box });
            break;
          }
        }
      }
      setTargets(previous => previous.size === next.size && [...next].every(([id, target]) => {
        const old = previous.get(id);
        return old?.node === target.node && Object.keys(target.box).every(key => old.box[key as keyof TargetBox] === target.box[key as keyof TargetBox]);
      }) ? previous : next);
    };
    const schedule = () => { if (!disposed && !raf) raf = requestAnimationFrame(scan); };
    const own = (node: Node) => (node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement)?.closest('[data-prototype-annotations]');
    const observe = (doc: Document) => {
      const mutation = new MutationObserver(records => { if (records.some(record => !own(record.target))) schedule(); });
      mutation.observe(doc.body, { childList: true, subtree: true, attributes: true, characterData: true });
      const resize = new ResizeObserver(schedule);
      resize.observe(doc.body);
      doc.addEventListener("scroll", schedule, true);
      doc.addEventListener("transitionend", schedule, true);
      doc.defaultView?.addEventListener("resize", schedule);
      doc.defaultView?.addEventListener("hashchange", schedule);
      return () => {
        mutation.disconnect(); resize.disconnect();
        doc.removeEventListener("scroll", schedule, true);
        doc.removeEventListener("transitionend", schedule, true);
        doc.defaultView?.removeEventListener("resize", schedule);
        doc.defaultView?.removeEventListener("hashchange", schedule);
      };
    };
    const connect = () => {
      cleanupDocument();
      try { const doc = frame ? frame.current?.contentDocument : document; if (doc?.body) cleanupDocument = observe(doc); } catch { /* Cross-origin frames cannot supply targets. */ }
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(host);
    const iframe = frame?.current;
    if (iframe) resize.observe(iframe);
    // Outer display scaling changes target coordinates without resizing the iframe viewport.
    const geometry = new MutationObserver(schedule);
    if (iframe) geometry.observe(host, { attributes: true, childList: true, subtree: true, attributeFilter: ["style", "hidden"] });
    iframe?.addEventListener("load", connect);
    window.addEventListener("resize", schedule);
    document.addEventListener("scroll", schedule, true);
    connect();
    return () => {
      disposed = true; cancelAnimationFrame(raf); cleanupDocument(); resize.disconnect(); geometry.disconnect();
      iframe?.removeEventListener("load", connect);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("scroll", schedule, true);
    };
  }, [rules, canvas, frame]);
  return { targets, applicable };
}
