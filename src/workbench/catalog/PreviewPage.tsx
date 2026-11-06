import { Component, Suspense, type ReactNode } from "react";
import { demoComponents, entries } from "./registry";

class PreviewBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <p role="alert" className="p-6 text-sm text-destructive">
        组件预览发生错误，请检查源码。
      </p>
    ) : (
      this.props.children
    );
  }
}

export default function PreviewPage() {
  const params = new URLSearchParams(location.search);
  const entry = entries.find((item) => item.id === params.get("preview"));
  const mobile = params.get("device") === "mobile";
  if (!entry || (mobile && entry.platform === "desktop"))
    return (
      <p role="alert" className="p-6 text-sm">
        此组件没有对应端的预览。
      </p>
    );
  const Demo = demoComponents.get(entry.id)!;
  return (
    <PreviewBoundary>
      <div
        role="region"
        aria-label="组件交互样本"
        className="catalog-demo-host flex min-h-screen items-center justify-center bg-white p-6 sm:p-10"
      >
        <Suspense
          fallback={
            <p role="status" className="text-sm text-muted-foreground">
              加载示例…
            </p>
          }
        >
          <Demo />
        </Suspense>
      </div>
    </PreviewBoundary>
  );
}
