import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePanelRef } from "react-resizable-panels";
import { RotateCcw, Scan, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import tokens from "@/design-system/tokens.json";
import AnnotationWorkspace from "./annotations/AnnotationWorkspace";
import { projectAnnotations } from "@/project/annotations";
import { usePrototypePan } from "./use-prototype-pan";

import "./desktop-prototype-stage.css";

const defaults = {
  width: tokens.sizes["desktop-default-width"],
  height: tokens.sizes["desktop-default-height"],
  minWidth: tokens.sizes["desktop-min-width"],
  minHeight: tokens.sizes["desktop-min-height"],
};
// Fixed offscreen space is clipped by the canvas box. Its size never follows the browser.
const RESIZE_SPACE = 16384;
const HANDLE = 16;

export default function DesktopPrototypeStage({
  src,
  title = "公司原型",
  page = "starter",
  active = true,
  rules = projectAnnotations, storageKey, designUrl,
}: {
  src?: string;
  title?: string;
  page?: string;
  active?: boolean;
  rules?: typeof projectAnnotations; storageKey?: string; designUrl?: string;
}) {
  const [size, setSize] = useState({
    width: defaults.width,
    height: defaults.height,
  });
  const [dragging, setDragging] = useState(false);
  const [fit, setFit] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const initialSource = useRef(src ?? `/?prototype=starter#${page}`);
  useEffect(() => {
    const iframe = frame.current;
    const sync = () => {
      try {
        const view = iframe?.contentWindow;
        if (view?.location.origin === location.origin && new URL(view.location.href).searchParams.get("prototype") === "starter") view.dispatchEvent(new CustomEvent("prototype:navigate", { detail: page }));
      } catch { /* Custom external previews do not participate in local navigation. */ }
    };
    iframe?.addEventListener("load", sync);
    if (iframe?.contentDocument?.readyState === "complete") sync();
    return () => iframe?.removeEventListener("load", sync);
  }, [page]);
  const widthPanel = usePanelRef();
  const heightPanel = usePanelRef();
  const sizeRef = useRef(size);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scene, scale, panning, rememberOffset, recenter } = usePrototypePan(
    frame,
    scrollRef,
    size.width,
    size.height,
    fit,
    active,
  );
  sizeRef.current = size;
  useEffect(() => {
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
    };
  }, []);

  function keyboardResize(
    event: KeyboardEvent<HTMLDivElement>,
    axis: "width" | "height",
  ) {
    const backward = axis === "width" ? "ArrowLeft" : "ArrowUp";
    const forward = axis === "width" ? "ArrowRight" : "ArrowDown";
    if (![backward, forward, "Home"].includes(event.key)) return;
    event.preventDefault();
    const min = axis === "width" ? defaults.minWidth : defaults.minHeight;
    const value =
      event.key === "Home"
        ? min
        : Math.max(
            min,
            sizeRef.current[axis] +
              (event.key === forward ? 1 : -1) * (event.shiftKey ? 40 : 8),
          );
    (axis === "width" ? widthPanel : heightPanel).current?.resize(value);
  }
  function reset() {
    widthPanel.current?.resize(defaults.width);
    heightPanel.current?.resize(defaults.height);
    recenter();
  }
  return (
    <AnnotationWorkspace
      active={active}
      page={page}
      rules={rules}
      storageKey={storageKey}
      designUrl={designUrl}
      frame={frame}
      toolbarContent={
        <div
          className="desktop-stage-toolbar"
          role="group"
          aria-label="原型画布控制"
          title="拖动窗口顶部空白处移动原型；右侧调宽、底部调高；仅回中保留尺寸"
        >
          <span className="desktop-stage-title">{title} 桌面原型</span>
          <output aria-live="polite" aria-label="原型画布尺寸">
            {size.width} × {size.height}
          </output>
          <span className="desktop-stage-minimum">
            最小 {defaults.minWidth} × {defaults.minHeight}
          </span>
          <Button type="button" variant="outline" size="sm" aria-label="适应窗口" aria-pressed={fit}
            title={fit ? "返回 100% 实际大小并居中" : "适应当前工作区，不改变原型尺寸"}
            onClick={() => { setFit(value => !value); recenter(); }}>
            <Scan size={14} /><span>适应窗口</span>
          </Button>
          <output className="desktop-stage-scale" aria-label="原型显示比例">{Math.round(scale * 100)}%</output>
          <Button type="button" variant="outline" size="sm" aria-label="仅回中" title="仅回中，保留原型尺寸和显示比例" onClick={recenter}>
            <Crosshair size={14} /><span>仅回中</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            title={`恢复 ${defaults.width} × ${defaults.height} 并居中；最小 ${defaults.minWidth} × ${defaults.minHeight}`}
            aria-label={`恢复 ${defaults.width} × ${defaults.height}`}
          >
            <RotateCcw size={14} />
            <span>
              恢复 {defaults.width} × {defaults.height}
            </span>
          </Button>
        </div>
      }
    >
      <div className="desktop-workbench">
        <div
          ref={scrollRef}
          className="desktop-stage-scroll"
          aria-label="桌面原型画布工作区"
          tabIndex={0}
          data-panning={panning}
          onScroll={rememberOffset}
        >
          <div
            className="desktop-stage-center"
            style={{ width: scene.width, height: scene.height }}
          >
            <div
              className="desktop-stage-window"
              style={{
                width: size.width,
                height: size.height,
                left: (scene.width - size.width * scale) / 2,
                top: (scene.height - size.height * scale) / 2,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <div className="desktop-resize-box" data-dragging={dragging}
                style={{ width: size.width + HANDLE, height: size.height + HANDLE }}>
              <ResizablePanelGroup
                orientation="horizontal"
                className="desktop-width-group"
                style={{ width: RESIZE_SPACE, height: size.height + HANDLE }}
              >
                <ResizablePanel
                  id="desktop-width"
                  style={{ overflow: "hidden" }}
                  panelRef={widthPanel}
                  defaultSize={defaults.width}
                  minSize={defaults.minWidth}
                  onResize={(next) =>
                    setSize((old) => ({
                      ...old,
                      width: Math.max(
                        defaults.minWidth,
                        Math.round(next.inPixels),
                      ),
                    }))
                  }
                >
                  <ResizablePanelGroup
                    orientation="vertical"
                    className="desktop-height-group"
                    style={{ height: RESIZE_SPACE }}
                  >
                    <ResizablePanel
                      id="desktop-height"
                      style={{ overflow: "hidden" }}
                      panelRef={heightPanel}
                      defaultSize={defaults.height}
                      minSize={defaults.minHeight}
                      onResize={(next) =>
                        setSize((old) => ({
                          ...old,
                          height: Math.max(
                            defaults.minHeight,
                            Math.round(next.inPixels),
                          ),
                        }))
                      }
                    >
                      <iframe
                        ref={frame}
                        title={`${title} 桌面交互原型`}
                        src={initialSource.current}
                        className="desktop-prototype-frame"
                        style={{ width: size.width, height: size.height }}
                      />
                    </ResizablePanel>
                    <ResizableHandle
                      withHandle
                      aria-label="调整原型高度"
                      aria-valuetext={`${size.height} 像素`}
                      className="desktop-height-handle"
                      onPointerDown={() => setDragging(true)}
                      onKeyDown={(e) => keyboardResize(e, "height")}
                    />
                    <ResizablePanel id="desktop-height-space" minSize={0} />
                  </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle
                  withHandle
                  aria-label="调整原型宽度"
                  aria-valuetext={`${size.width} 像素`}
                  className="desktop-width-handle"
                  onPointerDown={() => setDragging(true)}
                  onKeyDown={(e) => keyboardResize(e, "width")}
                />
                <ResizablePanel id="desktop-width-space" minSize={0} />
              </ResizablePanelGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnnotationWorkspace>
  );
}
