import * as Status from "@/components/ui/status-pill";

export function StatusPillDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Status.StatusPill tone="attention">关注样本</Status.StatusPill>
      <Status.StatusPill tone="success">完成样本</Status.StatusPill>
      <Status.StatusPill>普通样本</Status.StatusPill>
      <Status.StatusPill tone="info">关联样本</Status.StatusPill>
    </div>
  );
}
