import * as Separator from "@/components/ui/separator";

export function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-sm">水平分隔</p>
      <Separator.Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>内容 A</span>
        <Separator.Separator orientation="vertical" />
        <span>内容 B</span>
      </div>
    </div>
  );
}
