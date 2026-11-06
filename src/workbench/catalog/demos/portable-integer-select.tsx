import { useState } from "react";

import { IntegerSelect } from "@/components/ui/integer-select";

export function IntegerSelectDemo() {
  const [value, setValue] = useState(15);
  return <div className="flex flex-col gap-4 p-6"><IntegerSelect label="Receive interval" min={1} value={value} onValueChange={setValue} options={[5, 15, 30, 60]}/><IntegerSelect label="Disabled interval" disabled value={15} onValueChange={() => {}} options={[5, 15, 30, 60]}/><p role="status">Saved: {value}</p></div>;
}
