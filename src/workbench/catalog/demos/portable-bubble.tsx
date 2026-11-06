import { useState } from "react";

import * as B from "@/components/ui/bubble";

export function BubbleDemo() {
  const [reactions, setReactions] = useState(1);
  return (
    <B.BubbleGroup className="w-full max-w-lg gap-6">
      <B.Bubble variant="muted">
        <B.BubbleContent>
          接收气泡样本，支持多行内容与自动换行。
        </B.BubbleContent>
        <B.BubbleReactions>
          <button
            aria-label="增加气泡回应"
            onClick={() => setReactions(reactions + 1)}
          >
            👍 {reactions}
          </button>
        </B.BubbleReactions>
      </B.Bubble>
      <B.Bubble align="end">
        <B.BubbleContent>这是发送方向的气泡。</B.BubbleContent>
      </B.Bubble>
      <B.Bubble variant="outline">
        <B.BubbleContent>描边变体</B.BubbleContent>
      </B.Bubble>
      <B.Bubble variant="ghost">
        <B.BubbleContent>透明内容变体</B.BubbleContent>
      </B.Bubble>
    </B.BubbleGroup>
  );
}
