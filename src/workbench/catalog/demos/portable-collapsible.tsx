import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as C from "@/components/ui/collapsible";

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <C.Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm rounded-lg border p-4"
    >
      <C.CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full">
          {open ? "收起属性样本" : "展开属性样本"}
        </Button>
      </C.CollapsibleTrigger>
      <C.CollapsibleContent className="pt-4 text-sm">
        可展开的中性内容，只用于本地预览。
      </C.CollapsibleContent>
    </C.Collapsible>
  );
}
