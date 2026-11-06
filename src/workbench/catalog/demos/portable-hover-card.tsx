import { Button } from "@/components/ui/button";

import * as H from "@/components/ui/hover-card";

export function HoverCardDemo() {
  return (
    <H.HoverCard openDelay={200}>
      <H.HoverCardTrigger asChild>
        <Button variant="link">@sample-contact</Button>
      </H.HoverCardTrigger>
      <H.HoverCardContent>
        <div className="space-y-2">
          <strong className="text-sm">示例联系人</strong>
          <p className="text-sm text-muted-foreground">
            悬停或聚焦触发资料卡；此处仅演示组件能力。
          </p>
        </div>
      </H.HoverCardContent>
    </H.HoverCard>
  );
}
