import * as Badge from "@/components/ui/badge";

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge.Badge>默认</Badge.Badge>
      <Badge.Badge variant="secondary">次要</Badge.Badge>
      <Badge.Badge variant="outline">描边</Badge.Badge>
      <Badge.Badge variant="destructive">强调样本</Badge.Badge>
    </div>
  );
}
