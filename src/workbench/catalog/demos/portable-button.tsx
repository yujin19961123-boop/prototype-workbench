import { useState } from "react";

import * as Button from "@/components/ui/button";

import { Info } from "lucide-react";

export function ButtonDemo() {
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Button.Button onClick={() => setMessage("主要操作已触发")}>
          主要操作
        </Button.Button>
        <Button.Button
          variant="outline"
          onClick={() => setMessage("描边操作已触发")}
        >
          描边按钮
        </Button.Button>
        <Button.Button
          variant="ghost"
          onClick={() => setMessage("文字操作已触发")}
        >
          文字按钮
        </Button.Button>
        <Button.Button disabled>禁用</Button.Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button.Button size="xs">极小尺寸</Button.Button>
        <Button.Button size="sm">小尺寸</Button.Button>
        <Button.Button size="lg">大尺寸</Button.Button>
        <Button.Button variant="secondary">次要按钮</Button.Button>
        <Button.Button variant="link">链接按钮</Button.Button>
        {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
          <Button.Button
            key={size}
            size={size}
            variant="outline"
            aria-label={`${size} 图标尺寸样本`}
          >
            <Info className="size-4" />
          </Button.Button>
        ))}
      </div>
      <p role="status" className="min-h-5 text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
