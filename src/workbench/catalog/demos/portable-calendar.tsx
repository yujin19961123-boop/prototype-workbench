import { useState } from "react";

import * as CAL from "@/components/ui/calendar";

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 15));
  return (
    <div className="space-y-3">
      <CAL.Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={new Date(2026, 9, 1)}
        className="rounded-xl border"
        components={{
          DayButton: (props) => <CAL.CalendarDayButton {...props} />,
        }}
      />
      <p role="status" className="text-center text-xs text-muted-foreground">
        {date ? `已选日期：${date.toLocaleDateString("zh-CN")}` : "请选择日期"}
      </p>
    </div>
  );
}
