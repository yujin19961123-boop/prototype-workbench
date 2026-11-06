import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as AS from "@/components/blocks/action-status";

export function ActionStatusDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-4 text-center">
      {visible ? (
        <AS.ActionStatus
          message="处理中 · 样本"
          actionLabel="取消"
          onAction={() => setVisible(false)}
        />
      ) : (
        <Button variant="outline" onClick={() => setVisible(true)}>
          重新显示
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        只改变本地显示，没有发送、计时或排队任务。
      </p>
    </div>
  );
}
