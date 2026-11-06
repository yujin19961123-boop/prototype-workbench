import { useState } from "react";

import * as RC from "@/components/ui/recipient-chip";

import { Button } from "@/components/ui/button";

export function RecipientChipDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex flex-wrap gap-3">
      {visible ? (
        <RC.RecipientChip
          label="demo@example.invalid"
          onRemove={() => setVisible(false)}
        />
      ) : (
        <Button variant="outline" onClick={() => setVisible(true)}>
          恢复收件人标签
        </Button>
      )}
      <RC.RecipientChip label="readonly@example.invalid" />
    </div>
  );
}
