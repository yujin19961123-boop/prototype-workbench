import { useState } from "react";

import * as SF from "@/components/ui/search-field";

export function SearchFieldDemo() {
  const [query, setQuery] = useState("");
  return (
    <div className="w-full max-w-sm space-y-3">
      <SF.SearchField
        aria-label="搜索组件样本"
        placeholder="输入搜索文字"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <SF.SearchField
        variant="mail"
        aria-label="邮箱紧凑搜索样本"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p role="status" className="text-xs text-muted-foreground">
        {query ? `样本输入：${query}` : "输入只用于展示，不查询邮箱。"}
      </p>
    </div>
  );
}
