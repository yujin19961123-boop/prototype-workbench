import * as R from "@/components/ui/resizable";

export function ResizableDemo() {
  return (
    <R.ResizablePanelGroup
      orientation="horizontal"
      className="min-h-60 w-full max-w-2xl rounded-xl border"
    >
      <R.ResizablePanel defaultSize="35%" minSize="20%">
        <div className="flex h-full min-h-60 items-center justify-center text-sm">
          列表区
        </div>
      </R.ResizablePanel>
      <R.ResizableHandle withHandle />
      <R.ResizablePanel defaultSize="65%" minSize="25%">
        <div className="flex h-full items-center justify-center text-sm">
          拖动分隔线调整宽度
        </div>
      </R.ResizablePanel>
    </R.ResizablePanelGroup>
  );
}
