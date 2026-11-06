import { Bold, Italic, Underline } from "lucide-react";

import * as T from "@/components/ui/toggle";

export function ToggleDemo() {
  return (
    <div className="flex gap-3">
      <T.Toggle aria-label="加粗样本">
        <Bold />
      </T.Toggle>
      <T.Toggle variant="outline" aria-label="下划线样本">
        <Underline />
      </T.Toggle>
      <T.Toggle disabled aria-label="禁用格式样本">
        <Italic />
      </T.Toggle>
    </div>
  );
}
