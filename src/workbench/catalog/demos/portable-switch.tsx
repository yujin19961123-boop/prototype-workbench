import { useState } from "react";

import * as SW from "@/components/ui/switch";

export function SwitchDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="space-y-5 text-sm">
      <label className="flex items-center gap-4">
        开关样本
        <SW.Switch
          checked={checked}
          onCheckedChange={setChecked}
          className="data-[state=checked]:bg-brand-green data-[state=unchecked]:bg-switch-track"
        />
      </label>
      <label className="flex items-center gap-4 text-muted-foreground">
        禁用样本
        <SW.Switch disabled />
      </label>
      <p role="status" className="text-xs text-muted-foreground">
        {checked ? "已开启" : "已关闭"}，仅影响本地样本。
      </p>
    </div>
  );
}
