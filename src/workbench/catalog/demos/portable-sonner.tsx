import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import * as SN from "@/components/ui/sonner";

export function SonnerDemo() {
  const [status, setStatus] = useState("尚未触发通知");
  return (
    <div className="space-y-5">
      <SN.Toaster position="bottom-center" closeButton richColors />
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast("普通通知样本", { description: "内容仅用于组件演示。" })
          }
        >
          普通通知
        </Button>
        <Button
          onClick={() =>
            toast.success("样本保存成功", {
              action: {
                label: "撤销",
                onClick: () => setStatus("已撤销样本操作"),
              },
            })
          }
        >
          成功与操作
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.error("错误状态样本")}
        >
          错误通知
        </Button>
      </div>
      <p role="status" className="text-center text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
