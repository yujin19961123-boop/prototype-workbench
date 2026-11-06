import { useState } from "react";
import { AsyncState } from "@/components/blocks/async-state";
import { ListDetailLayout } from "@/components/blocks/list-detail-layout";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

const documents = [
  { id: "review", title: "产品评审安排", body: "评审安排在周四下午。请提前阅读议程，并在会前提交需要讨论的问题。" },
  { id: "release", title: "版本发布说明", body: "本次发布包含搜索、列表筛选和表单体验优化。上线后请核对工作台入口。" },
  { id: "handoff", title: "设计交接指南", body: "交接时请附设计稿、组件来源和主要状态，并注明待确认的边界条件。" },
];

export default function ListDetailRecipe() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const search = query.trim().toLowerCase();
  const results = documents.filter(document => `${document.title} ${document.body}`.toLowerCase().includes(search));
  const selected = results.find(document => document.id === selectedId);
  return <ListDetailLayout
    sidebarWidth="200px"
    header={<h2 className="p-4">资料目录</h2>}
    sidebar={<div className="p-4"><SearchField aria-label="搜索资料" placeholder="搜索资料" value={query} onChange={event => setQuery(event.target.value)}/></div>}
    list={<div className="grid gap-2 p-4">{results.length ? results.map(document =>
      <Button key={document.id} variant={selected?.id === document.id ? "secondary" : "ghost"} aria-pressed={selected?.id === document.id} onClick={() => setSelectedId(document.id)}>{document.title}</Button>
    ) : <AsyncState kind="noResults"/>}</div>}
    detail={selected ? <article className="grid gap-4 p-6"><h2>{selected.title}</h2><p>{selected.body}</p></article> : <AsyncState kind="empty" messages={{ empty: "选择一份资料查看详情" }}/>}
  />;
}
