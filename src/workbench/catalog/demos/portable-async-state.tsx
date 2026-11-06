import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as Async from "@/components/blocks/async-state";

export function AsyncStateDemo() {
  const [kind, setKind] = useState<Async.AsyncStateKind>("empty");
  const [message, setMessage] = useState("");
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-wrap gap-2">
        {(["loading", "empty", "noResults", "error"] as const).map(
          (value, index) => (
            <Button
              key={value}
              size="sm"
              variant={kind === value ? "secondary" : "outline"}
              aria-pressed={kind === value}
              onClick={() => {
                setKind(value);
                setMessage("");
              }}
            >
              {["加载", "空态", "无结果", "错误"][index]}
            </Button>
          ),
        )}
      </div>
      <Async.AsyncState
        kind={kind}
        onRetry={() => setMessage("重试回调样本已触发，没有网络请求")}
      />
      <p role="status" className="text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
