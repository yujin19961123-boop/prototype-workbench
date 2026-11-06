import * as PP from "@/components/ui/product-patterns";

export function ProductPatternsDemo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PP.CountBadge count={5} />
        <PP.CountBadge count={120} />
        <PP.LabelBadge>标签样本</PP.LabelBadge>
      </div>
      <PP.FilterGroup
        type="single"
        defaultValue="all"
        aria-label="胶囊筛选样本"
      >
        <PP.FilterItem value="all">全部</PP.FilterItem>
        <PP.FilterItem value="unread">未读</PP.FilterItem>
        <PP.FilterItem value="mention">提及我</PP.FilterItem>
      </PP.FilterGroup>
    </div>
  );
}
