import { useState } from "react";

import * as C from "@/components/ui/context-menu";

export function ContextMenuDemo() {
  const [checked, setChecked] = useState(true);
  const [value, setValue] = useState("compact");
  const [status, setStatus] = useState("");
  return (
    <div className="space-y-4">
      <C.ContextMenu>
        <C.ContextMenuTrigger asChild>
          <button className="rounded-lg border border-dashed p-10 text-sm">
            右键或 Shift+F10 打开菜单
          </button>
        </C.ContextMenuTrigger>
        <C.ContextMenuPortal>
          <C.ContextMenuContent>
            <C.ContextMenuGroup>
              <C.ContextMenuLabel>样本菜单</C.ContextMenuLabel>
              <C.ContextMenuItem onSelect={() => setStatus("已选择操作")}>
                样本操作<C.ContextMenuShortcut>⌘K</C.ContextMenuShortcut>
              </C.ContextMenuItem>
            </C.ContextMenuGroup>
            <C.ContextMenuSeparator />
            <C.ContextMenuCheckboxItem
              checked={checked}
              onCheckedChange={setChecked}
            >
              显示说明
            </C.ContextMenuCheckboxItem>
            <C.ContextMenuRadioGroup value={value} onValueChange={setValue}>
              <C.ContextMenuRadioItem value="compact">
                紧凑
              </C.ContextMenuRadioItem>
              <C.ContextMenuRadioItem value="comfortable">
                宽松
              </C.ContextMenuRadioItem>
            </C.ContextMenuRadioGroup>
            <C.ContextMenuSub>
              <C.ContextMenuSubTrigger>更多样本</C.ContextMenuSubTrigger>
              <C.ContextMenuSubContent>
                <C.ContextMenuItem onSelect={() => setStatus("子菜单已选择")}>
                  子菜单项
                </C.ContextMenuItem>
              </C.ContextMenuSubContent>
            </C.ContextMenuSub>
          </C.ContextMenuContent>
        </C.ContextMenuPortal>
      </C.ContextMenu>
      <p role="status" className="text-xs">
        {status}
      </p>
    </div>
  );
}
