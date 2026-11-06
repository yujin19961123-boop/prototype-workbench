import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as D from "@/components/ui/drawer";

export function DrawerDemo() {
  const [value, setValue] = useState(3);
  return (
    <D.Drawer>
      <D.DrawerTrigger asChild>
        <Button variant="outline">打开底部抽屉</Button>
      </D.DrawerTrigger>
      <D.DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <D.DrawerHeader>
            <D.DrawerTitle>抽屉样本</D.DrawerTitle>
            <D.DrawerDescription>调整本地演示数值。</D.DrawerDescription>
          </D.DrawerHeader>
          <div className="flex items-center justify-center gap-6 p-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="减少数值"
              disabled={value === 0}
              onClick={() => setValue(value - 1)}
            >
              −
            </Button>
            <output>{value}</output>
            <Button
              variant="outline"
              size="icon"
              aria-label="增加数值"
              onClick={() => setValue(value + 1)}
            >
              +
            </Button>
          </div>
          <D.DrawerFooter>
            <D.DrawerClose asChild>
              <Button>完成</Button>
            </D.DrawerClose>
            <D.DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </D.DrawerClose>
          </D.DrawerFooter>
        </div>
      </D.DrawerContent>
    </D.Drawer>
  );
}
