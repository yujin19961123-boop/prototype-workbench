import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

import * as T from "@/components/ui/tooltip";

export function TooltipDemo() {
  return (
    <T.TooltipProvider delayDuration={150}>
      <T.Tooltip>
        <T.TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="查看提示">
            <Info className="size-4" />
          </Button>
        </T.TooltipTrigger>
        <T.TooltipContent>这是一条简短的提示说明。</T.TooltipContent>
      </T.Tooltip>
    </T.TooltipProvider>
  );
}
