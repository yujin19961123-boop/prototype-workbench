import { useState } from "react";

import * as S from "@/components/blocks/schedule-summary";

export function ScheduleSummaryDemo() {
  const [message, setMessage] = useState("");
  return (
    <div className="w-full max-w-sm space-y-4">
      <S.ScheduleSummary
        title="日程标题样本"
        timeLabel="日期与起止时间展示样本"
        organizer="示例组织者"
        participants="示例参与者"
        onAction={(action) => setMessage(`响应回调：${action}；未更新真实邀请`)}
      />
      <p role="status" className="text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
