import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import * as P from "@/components/ui/popover";

export function PopoverDemo() {
  return (
    <P.Popover>
      <P.PopoverAnchor asChild>
        <div>
          <P.PopoverTrigger asChild>
            <Button variant="outline">打开浮层</Button>
          </P.PopoverTrigger>
        </div>
      </P.PopoverAnchor>
      <P.PopoverContent className="w-64 space-y-4">
        <P.PopoverHeader>
          <P.PopoverTitle>浮层样本</P.PopoverTitle>
          <P.PopoverDescription>可以容纳轻量表单。</P.PopoverDescription>
        </P.PopoverHeader>
        <div className="space-y-2">
          <Label htmlFor="popover-name">名称</Label>
          <Input id="popover-name" placeholder="本地样本" />
        </div>
      </P.PopoverContent>
    </P.Popover>
  );
}
