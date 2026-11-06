import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

// Spare scene space lets the scroll viewport move a prototype in every direction.
// It changes workbench coordinates only; iframe dimensions stay untouched.
const PAN_SPACE = 4096;

export function usePrototypePan(frame: RefObject<HTMLIFrameElement | null>, viewport: RefObject<HTMLDivElement | null>, width: number, height: number, fit = false, active = true) {
  const [available, setAvailable] = useState({ width: 0, height: 0 });
  const [panning, setPanning] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const scale = fit && available.width && available.height ? Math.min(1, Math.max(1, available.width - 48) / (width + 16), Math.max(1, available.height - 64) / (height + 16)) : 1;
  const scene = { width: Math.max(available.width, width * scale) + PAN_SPACE * 2, height: Math.max(available.height, height * scale) + PAN_SPACE * 2 };

  useLayoutEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const resize = new ResizeObserver(() => {
      if (!node.clientWidth || !node.clientHeight) return; // A hidden workbench keeps its last geometry.
      setAvailable(old => old.width === node.clientWidth && old.height === node.clientHeight ? old : { width: node.clientWidth, height: node.clientHeight });
    });
    resize.observe(node);
    return () => resize.disconnect();
  }, [viewport]);
  useLayoutEffect(() => {
    const node = viewport.current;
    if (!node || !active) return;
    node.scrollLeft = (scene.width - node.clientWidth) / 2 - offset.current.x;
    node.scrollTop = (scene.height - node.clientHeight) / 2 - offset.current.y;
  }, [scene.width, scene.height, available.width, available.height, viewport, active]);

  const rememberOffset = useCallback(() => {
    const node = viewport.current;
    if (!active || !node?.clientWidth || !node.clientHeight) return;
    // Ignore the browser's interim scroll event while ResizeObserver is updating scene geometry.
    if (node && (node.clientWidth !== available.width || node.clientHeight !== available.height)) return;
    if (node) {
      const x = (node.scrollWidth - node.clientWidth) / 2 - node.scrollLeft;
      const y = (node.scrollHeight - node.clientHeight) / 2 - node.scrollTop;
      // Native scroll offsets round fractional CSS pixels; do not accumulate that rounding as a user pan.
      offset.current = { x: Math.abs(x) <= 1 ? 0 : x, y: Math.abs(y) <= 1 ? 0 : y };
    }
  }, [viewport, available.width, available.height, active]);
  const recenter = useCallback(() => {
    offset.current = { x: 0, y: 0 };
    const node = viewport.current;
    if (node) node.scrollTo({ left: (node.scrollWidth - node.clientWidth) / 2, top: (node.scrollHeight - node.clientHeight) / 2 });
  }, [viewport]);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let disconnect = () => {};
    const connect = () => {
      disconnect();
      const doc = iframe.contentDocument;
      if (!doc) return;
      let titlebar: HTMLElement | null = null;
      let oldCursor = "", oldTouch = "", oldSelect = "";
      let drag: { id: number; x: number; y: number; left: number; top: number } | null = null;
      const stop = () => {
        const id = drag?.id;
        drag = null;
        setPanning(false);
        if (titlebar) {
          titlebar.style.cursor = "grab";
          if (id !== undefined && titlebar.hasPointerCapture(id)) titlebar.releasePointerCapture(id);
        }
      };
      const start = (event: PointerEvent) => {
        const node = viewport.current, target = event.target as Element;
        if (!node || !titlebar || !event.isPrimary || event.button !== 0 || !titlebar.contains(target) || target.closest('a,button,input,select,textarea,[role="button"],[data-prototype-window-actions]')) return;
        event.preventDefault();
        const rect = iframe.getBoundingClientRect();
        drag = { id: event.pointerId, x: rect.left + event.clientX * rect.width / iframe.offsetWidth, y: rect.top + event.clientY * rect.height / iframe.offsetHeight, left: node.scrollLeft, top: node.scrollTop };
        titlebar.setPointerCapture(event.pointerId);
        titlebar.style.cursor = "grabbing";
        setPanning(true);
      };
      const move = (event: PointerEvent) => {
        const node = viewport.current;
        if (!drag || !node || event.pointerId !== drag.id) return;
        event.preventDefault();
        const rect = iframe.getBoundingClientRect();
        node.scrollTo({ left: drag.left - (rect.left + event.clientX * rect.width / iframe.offsetWidth - drag.x), top: drag.top - (rect.top + event.clientY * rect.height / iframe.offsetHeight - drag.y) });
      };
      const release = (event: PointerEvent) => { if (drag?.id === event.pointerId) stop(); };
      const findTitlebar = () => {
        const next = doc.querySelector<HTMLElement>('[data-prototype-drag-handle]');
        if (next === titlebar) return;
        stop();
        if (titlebar) {
          titlebar.style.cursor = oldCursor;
          titlebar.style.touchAction = oldTouch;
          titlebar.style.userSelect = oldSelect;
        }
        titlebar = next;
        if (titlebar) {
          oldCursor = titlebar.style.cursor; oldTouch = titlebar.style.touchAction; oldSelect = titlebar.style.userSelect;
          titlebar.style.cursor = "grab"; titlebar.style.touchAction = "none"; titlebar.style.userSelect = "none";
        }
      };
      const observer = new MutationObserver(findTitlebar);
      observer.observe(doc, { childList: true, subtree: true });
      doc.addEventListener("pointerdown", start, true);
      doc.addEventListener("pointermove", move, true);
      doc.addEventListener("pointerup", release, true);
      doc.addEventListener("pointercancel", release, true);
      doc.addEventListener("lostpointercapture", release, true);
      doc.defaultView?.addEventListener("blur", stop);
      window.addEventListener("blur", stop);
      findTitlebar();
      disconnect = () => {
        stop(); observer.disconnect();
        doc.removeEventListener("pointerdown", start, true);
        doc.removeEventListener("pointermove", move, true);
        doc.removeEventListener("pointerup", release, true);
        doc.removeEventListener("pointercancel", release, true);
        doc.removeEventListener("lostpointercapture", release, true);
        doc.defaultView?.removeEventListener("blur", stop);
        window.removeEventListener("blur", stop);
        if (titlebar) { titlebar.style.cursor = oldCursor; titlebar.style.touchAction = oldTouch; titlebar.style.userSelect = oldSelect; }
      };
    };
    iframe.addEventListener("load", connect);
    connect();
    return () => { iframe.removeEventListener("load", connect); disconnect(); };
  }, [frame, viewport]);
  return { scene, scale, panning, rememberOffset, recenter };
}
