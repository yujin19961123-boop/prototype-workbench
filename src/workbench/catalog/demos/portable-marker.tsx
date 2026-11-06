import { CalendarDays } from "lucide-react";

import * as MK from "@/components/ui/marker";

export function MarkerDemo() {
  return (
    <div className="w-full max-w-lg space-y-8">
      <MK.Marker variant="separator">
        <MK.MarkerContent>今天</MK.MarkerContent>
      </MK.Marker>
      <MK.Marker>
        <MK.MarkerIcon>
          <CalendarDays />
        </MK.MarkerIcon>
        <MK.MarkerContent>日期与事件标记样本</MK.MarkerContent>
      </MK.Marker>
      <MK.Marker variant="border">
        <MK.MarkerContent>带底部分隔线的标记</MK.MarkerContent>
      </MK.Marker>
    </div>
  );
}
