import { useState } from "react";

import * as C from "@/components/ui/combobox";

export function ComboboxDemo() {
  const [value, setValue] = useState<string[]>(["React"]);
  const anchor = C.useComboboxAnchor();
  const items = ["React", "Vite", "Tailwind CSS", "shadcn/ui"];
  const groups = [
    { label: "前端", items: ["React", "Vite"] },
    { label: "样式", items: ["Tailwind CSS", "shadcn/ui"] },
  ];
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">搜索与分组</p>
        <C.Combobox items={groups}>
          <C.ComboboxInput
            aria-label="搜索组件技术"
            placeholder="搜索技术…"
            showClear
          />
          <C.ComboboxContent>
            <C.ComboboxEmpty>没有匹配项</C.ComboboxEmpty>
            <C.ComboboxList>
              {(group: (typeof groups)[number], index: number) => (
                <C.ComboboxGroup key={group.label} items={group.items}>
                  <C.ComboboxLabel>{group.label}</C.ComboboxLabel>
                  <C.ComboboxCollection>
                    {(item: string) => (
                      <C.ComboboxItem key={item} value={item}>
                        {item}
                      </C.ComboboxItem>
                    )}
                  </C.ComboboxCollection>
                  {index === 0 && <C.ComboboxSeparator />}
                </C.ComboboxGroup>
              )}
            </C.ComboboxList>
          </C.ComboboxContent>
        </C.Combobox>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">多选与标签</p>
        <C.Combobox
          items={items}
          multiple
          value={value}
          onValueChange={setValue}
        >
          <C.ComboboxChips ref={anchor}>
            <C.ComboboxValue>
              {value.map((item) => (
                <C.ComboboxChip key={item}>{item}</C.ComboboxChip>
              ))}
            </C.ComboboxValue>
            <C.ComboboxChipsInput
              aria-label="添加多选技术"
              placeholder="添加技术…"
            />
          </C.ComboboxChips>
          <C.ComboboxContent anchor={anchor}>
            <C.ComboboxEmpty>没有匹配项</C.ComboboxEmpty>
            <C.ComboboxList>
              {(item: string) => (
                <C.ComboboxItem key={item} value={item}>
                  {item}
                </C.ComboboxItem>
              )}
            </C.ComboboxList>
          </C.ComboboxContent>
        </C.Combobox>
      </div>
    </div>
  );
}
