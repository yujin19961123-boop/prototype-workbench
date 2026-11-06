import { StatusPill } from "@/components/ui/status-pill";

import * as W from "@/components/blocks/work-card";

export function WorkCardDemo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <W.WorkCard
        title="事项标题与属性展开样本"
        progress={{ value: 50, label: "1 / 2" }}
        status={<StatusPill tone="attention">关注样本</StatusPill>}
        details={
          <p className="text-xs text-muted-foreground">中性属性：样本值。</p>
        }
      />
      <W.WorkCard
        title="已完成事项外观样本"
        completed
        progress={{ value: 100, label: "1 / 1" }}
        status={<StatusPill tone="success">完成样本</StatusPill>}
      />
      <W.WorkCard
        title="蓝色顶边强调样本"
        emphasized
        status={<StatusPill>普通样本</StatusPill>}
      />
    </div>
  );
}
