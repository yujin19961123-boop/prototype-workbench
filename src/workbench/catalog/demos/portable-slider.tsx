import { useState } from "react";

import * as SL from "@/components/ui/slider";

export function SliderDemo() {
  const [value, setValue] = useState([15]);
  return (
    <div className="w-full max-w-sm space-y-5">
      <label id="slider-label" className="text-sm">
        数值样本
      </label>
      <SL.Slider
        aria-labelledby="slider-label"
        min={0}
        max={30}
        step={5}
        value={value}
        onValueChange={setValue}
      />
      <output
        className="block text-xs text-muted-foreground"
        aria-live="polite"
      >
        当前值：{value[0]}（仅预览）
      </output>
      <SL.Slider aria-label="禁用滑块" defaultValue={[10]} max={30} disabled />
    </div>
  );
}
