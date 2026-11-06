import * as C from "@/components/ui/checkbox";

import * as I from "@/components/ui/input";

import * as L from "@/components/ui/label";

export function LabelDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="mb-5 flex items-center gap-2">
        <C.Checkbox id="label-terms" />
        <L.Label htmlFor="label-terms">接受条款与条件</L.Label>
      </div>
      <L.Label htmlFor="label-demo">点击标签聚焦输入框</L.Label>
      <I.Input id="label-demo" placeholder="关联字段" />
    </div>
  );
}
