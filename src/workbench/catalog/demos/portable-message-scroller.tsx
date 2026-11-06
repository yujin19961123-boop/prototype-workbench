import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as B from "@/components/ui/bubble";

import * as SC from "@/components/ui/message-scroller";

export function MessageScrollerDemo() {
  const [count, setCount] = useState(12);
  return (
    <div className="w-full max-w-xl space-y-3">
      <SC.MessageScrollerProvider>
        <SC.MessageScroller className="h-72 rounded-xl border">
          <SC.MessageScrollerViewport>
            <SC.MessageScrollerContent className="gap-4 p-4">
              {Array.from({ length: count }, (_, i) => (
                <SC.MessageScrollerItem key={i} scrollAnchor={i === count - 1}>
                  <B.Bubble
                    variant={i % 2 ? "default" : "muted"}
                    align={i % 2 ? "end" : "start"}
                  >
                    <B.BubbleContent>第 {i + 1} 条本地消息样本</B.BubbleContent>
                  </B.Bubble>
                </SC.MessageScrollerItem>
              ))}
            </SC.MessageScrollerContent>
          </SC.MessageScrollerViewport>
          <SC.MessageScrollerButton direction="start" />
          <SC.MessageScrollerButton direction="end" />
        </SC.MessageScroller>
        <Button variant="outline" onClick={() => setCount(count + 1)}>
          追加消息样本
        </Button>
      </SC.MessageScrollerProvider>
    </div>
  );
}
