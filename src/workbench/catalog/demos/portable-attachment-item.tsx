import { useState } from "react";

import * as A from "@/components/blocks/attachment-item";

export function AttachmentItemDemo() {
  const [message, setMessage] = useState("");
  return (
    <div className="w-full max-w-xs space-y-4">
      <A.AttachmentItem
        name="说明文档样本.pdf"
        sizeLabel="36 KB · 样本"
        onOpen={() => setMessage("已触发打开回调，未读取文件")}
      />
      <A.AttachmentItem
        name="无回调的静态附件样本.txt"
        sizeLabel="2 KB · 样本"
      />
      <p role="status" className="text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
