import { useState } from "react";

import { Search, ArrowUp } from "lucide-react";

import * as I from "@/components/ui/input-group";

export function InputGroupDemo() {
  const [status, setStatus] = useState("尚未提交样本");
  return (
    <div className="w-full max-w-sm space-y-5">
      <I.InputGroup>
        <I.InputGroupAddon>
          <Search />
        </I.InputGroupAddon>
        <I.InputGroupInput aria-label="组合搜索" placeholder="搜索样本…" />
        <I.InputGroupAddon align="inline-end">
          <I.InputGroupText>⌘ K</I.InputGroupText>
        </I.InputGroupAddon>
      </I.InputGroup>
      <I.InputGroup>
        <I.InputGroupTextarea aria-label="组合文本区" placeholder="输入说明…" />
        <I.InputGroupAddon align="block-end">
          <I.InputGroupText>仅本地演示</I.InputGroupText>
          <I.InputGroupButton
            className="ml-auto"
            size="icon-xs"
            variant="default"
            aria-label="提交输入组样本"
            onClick={() => setStatus("已提交本地样本")}
          >
            <ArrowUp />
          </I.InputGroupButton>
        </I.InputGroupAddon>
      </I.InputGroup>
      <p role="status" className="text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  );
}
