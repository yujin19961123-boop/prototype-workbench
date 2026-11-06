import * as Scroll from "@/components/ui/scroll-area";

export function ScrollAreaDemo() {
  return (
    <Scroll.ScrollArea
      className="h-56 w-full max-w-sm rounded-lg border"
      tabIndex={0}
      aria-label="双向滚动样本"
    >
      <div className="w-[520px] p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="border-b py-3 text-xs">
            样本条目 {i + 1} · 内容较宽，可水平及垂直滚动。
          </p>
        ))}
      </div>
      <Scroll.ScrollBar orientation="horizontal" />
    </Scroll.ScrollArea>
  );
}
