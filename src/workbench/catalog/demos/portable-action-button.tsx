import { useState } from "react";

import { Download, Mail, Plus } from "lucide-react";

import { IconButton, CommandButton, SplitButton } from "@/components/ui/action-button";

export function ActionButtonDemo() {
  const [status, setStatus] = useState("");
  return <div className="space-y-4"><div className="flex items-center gap-4"><IconButton label="添加" onClick={() => setStatus("添加")}><Plus size={16}/></IconButton><CommandButton icon={<Download size={18}/>} onClick={() => setStatus("下载")}>下载</CommandButton><CommandButton density="comfortable" icon={<Download size="var(--size-icon-ribbon)"/>} onClick={() => setStatus("宽松命令")}>宽松命令</CommandButton><SplitButton onAction={() => setStatus("主操作")} onMenuAction={() => setStatus("更多操作")}><Mail size={16}/>发送</SplitButton></div><p role="status">{status}</p></div>;
}
