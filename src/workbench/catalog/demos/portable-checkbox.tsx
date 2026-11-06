import { useState } from "react";

import * as C from "@/components/ui/checkbox";

export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="space-y-5 text-sm">
      <label className="flex items-center gap-3">
        <C.Checkbox
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
        />
        接收样本通知
      </label>
      <label className="flex items-center gap-3">
        <C.Checkbox checked="indeterminate" />
        半选状态样本
      </label>
      <label className="flex items-center gap-3 text-muted-foreground">
        <C.Checkbox disabled />
        禁用状态
      </label>
      <p role="status" className="text-xs text-muted-foreground">
        {checked ? "已选中" : "未选中"}
      </p>
    </div>
  );
}
