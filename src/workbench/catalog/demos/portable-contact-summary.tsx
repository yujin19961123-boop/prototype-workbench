import { useState } from "react";

import * as C from "@/components/blocks/contact-summary";

export function ContactSummaryDemo() {
  const [message, setMessage] = useState("");
  return (
    <div className="w-full max-w-sm space-y-6">
      <C.ContactSummary
        name="示例联系人 A"
        email="person-a@example.invalid"
        subtitle="职业信息样本"
        matched
        onPrimary={() => setMessage("已触发添加回调")}
        onSecondary={() => setMessage("已触发写信回调")}
        onMore={() => setMessage("已触发更多回调")}
      />
      <C.ContactSummary
        name="示例联系人 B"
        email="person-b@example.invalid"
        matched={false}
        onPrimary={() => setMessage("已触发写信回调")}
        onSecondary={() => setMessage("已触发往来邮件回调")}
      />
      <p role="status" className="text-xs text-muted-foreground">
        {message} · 无账号查询或邮件操作。
      </p>
    </div>
  );
}
