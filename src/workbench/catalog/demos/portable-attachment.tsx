import { useState } from "react";

import { FileText, Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import * as A from "@/components/ui/attachment";

export function AttachmentDemo() {
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState("点击附件或操作按钮查看反馈");
  return (
    <div className="w-full max-w-lg space-y-5">
      <A.AttachmentGroup>
        {visible && (
          <A.Attachment>
            <A.AttachmentTrigger
              aria-label="预览示例文档"
              onClick={() => setStatus("已打开文档预览样本")}
            />
            <A.AttachmentMedia>
              <FileText />
            </A.AttachmentMedia>
            <A.AttachmentContent>
              <A.AttachmentTitle>组件说明.pdf</A.AttachmentTitle>
              <A.AttachmentDescription>
                样本文件 · 128 KB
              </A.AttachmentDescription>
            </A.AttachmentContent>
            <A.AttachmentActions>
              <A.AttachmentAction
                aria-label="模拟下载附件"
                onClick={() => setStatus("已触发下载样本，无真实文件传输")}
              >
                <Download />
              </A.AttachmentAction>
              <A.AttachmentAction
                aria-label="移除附件样本"
                onClick={() => setVisible(false)}
              >
                <X />
              </A.AttachmentAction>
            </A.AttachmentActions>
          </A.Attachment>
        )}
        <A.Attachment state="error" size="sm">
          <A.AttachmentMedia>
            <FileText />
          </A.AttachmentMedia>
          <A.AttachmentContent>
            <A.AttachmentTitle>失败状态.txt</A.AttachmentTitle>
            <A.AttachmentDescription>上传失败样本</A.AttachmentDescription>
          </A.AttachmentContent>
        </A.Attachment>
      </A.AttachmentGroup>
      <p role="status" className="text-xs text-muted-foreground">
        {status}
      </p>
      {!visible && (
        <Button variant="outline" onClick={() => setVisible(true)}>
          恢复附件样本
        </Button>
      )}
    </div>
  );
}
