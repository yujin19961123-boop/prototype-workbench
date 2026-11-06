import { useState } from "react";

import * as TA from "@/components/ui/textarea";

export function TextareaDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-sm space-y-3">
      <label htmlFor="textarea-demo" className="text-sm">
        说明
      </label>
      <TA.Textarea
        id="textarea-demo"
        placeholder="输入说明样本"
        maxLength={300}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-describedby="textarea-count"
      />
      <p
        id="textarea-count"
        className="text-right text-xs text-muted-foreground"
      >
        {value.length} / 300 · 示例参数
      </p>
    </div>
  );
}
