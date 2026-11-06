import { Bold, Italic, Underline } from "lucide-react";

import * as TG from "@/components/ui/toggle-group";

export function ToggleGroupDemo() {
  return (
    <div className="space-y-6">
      <TG.ToggleGroup type="multiple" aria-label="格式多选样本" spacing={1}>
        <TG.ToggleGroupItem value="bold" aria-label="加粗">
          <Bold />
        </TG.ToggleGroupItem>
        <TG.ToggleGroupItem value="italic" aria-label="斜体">
          <Italic />
        </TG.ToggleGroupItem>
        <TG.ToggleGroupItem value="underline" aria-label="下划线">
          <Underline />
        </TG.ToggleGroupItem>
      </TG.ToggleGroup>
      <TG.ToggleGroup
        type="single"
        defaultValue="a"
        variant="outline"
        spacing={1}
        aria-label="单选按钮组"
      >
        <TG.ToggleGroupItem value="a">选项 A</TG.ToggleGroupItem>
        <TG.ToggleGroupItem value="b">选项 B</TG.ToggleGroupItem>
      </TG.ToggleGroup>
    </div>
  );
}
