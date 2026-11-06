import { useState } from "react";

import { Button } from "@/components/ui/button";

import * as DM from "@/components/ui/dropdown-menu";

export function DropdownMenuDemo() {
  const [checked, setChecked] = useState(false);
  const [mode, setMode] = useState("a");
  const [feedback, setFeedback] = useState("");
  return (
    <div className="space-y-4 text-center">
      <DM.DropdownMenu>
        <DM.DropdownMenuTrigger asChild>
          <Button variant="outline">打开菜单</Button>
        </DM.DropdownMenuTrigger>
        <DM.DropdownMenuContent className="w-56">
          <DM.DropdownMenuLabel>菜单分组样本</DM.DropdownMenuLabel>
          <DM.DropdownMenuGroup>
            <DM.DropdownMenuItem
              onSelect={() => setFeedback("已触发菜单操作样本")}
            >
              普通操作<DM.DropdownMenuShortcut>⌘K</DM.DropdownMenuShortcut>
            </DM.DropdownMenuItem>
            <DM.DropdownMenuItem disabled>禁用操作</DM.DropdownMenuItem>
          </DM.DropdownMenuGroup>
          <DM.DropdownMenuSeparator />
          <DM.DropdownMenuCheckboxItem
            checked={checked}
            onCheckedChange={setChecked}
          >
            可选状态样本
          </DM.DropdownMenuCheckboxItem>
          <DM.DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
            <DM.DropdownMenuRadioItem value="a">
              模式 A
            </DM.DropdownMenuRadioItem>
            <DM.DropdownMenuRadioItem value="b">
              模式 B
            </DM.DropdownMenuRadioItem>
          </DM.DropdownMenuRadioGroup>
          <DM.DropdownMenuSeparator />
          <DM.DropdownMenuSub>
            <DM.DropdownMenuSubTrigger>二级菜单</DM.DropdownMenuSubTrigger>
            <DM.DropdownMenuPortal>
              <DM.DropdownMenuSubContent>
                <DM.DropdownMenuItem
                  onSelect={() => setFeedback("已触发子菜单样本")}
                >
                  子操作样本
                </DM.DropdownMenuItem>
              </DM.DropdownMenuSubContent>
            </DM.DropdownMenuPortal>
          </DM.DropdownMenuSub>
        </DM.DropdownMenuContent>
      </DM.DropdownMenu>
      <p className="text-xs text-muted-foreground">
        选择：{mode.toUpperCase()} · {checked ? "已勾选" : "未勾选"}
      </p>
      <p role="status" className="text-xs text-muted-foreground">
        {feedback}
      </p>
    </div>
  );
}
