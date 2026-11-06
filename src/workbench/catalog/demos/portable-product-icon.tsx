import { useState } from "react";

import { ProductIcon } from "@/components/ui/product-icon";

import { Input } from "@/components/ui/input";

import assets from "@/design-system/icon-catalog.json";

export function ProductIconDemo() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = assets.filter(
    (a) =>
      (category === "all" || a.category === category) &&
      `${a.path} ${a.usage} ${a.name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="space-y-3">
        <Input
          aria-label="搜索产品图标"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文件名或用途…"
        />
        <select
          className="h-8 w-full rounded-lg border px-2 text-sm"
          aria-label="产品图标分类"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">全部分类</option>
          {[...new Set(assets.map((a) => a.category))].map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
        <p role="status" className="text-xs text-muted-foreground">
          {filtered.length} / {assets.length} 个 SVG · 保留原色、画布和透明度
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <div key={a.path} className="min-w-0 rounded-lg border bg-card p-3">
            <div className="mb-3 flex min-h-9 items-center gap-4">
              <ProductIcon name={a.path} loading="lazy" />
              <ProductIcon name={a.path} size={28} loading="lazy" />
              <span className="text-xs text-muted-foreground">
                {a.width} × {a.height}
              </span>
            </div>
            <p className="text-xs font-medium">{a.usage}</p>
            <p className="mt-1 break-all text-[10px] text-muted-foreground">
              {a.path}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {a.style} · {a.state}
              {a.confidence === "visual-inference" ? " · 用途待核对" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
