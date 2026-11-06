import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { projectConfig } from "../project.config";
import { projectAnnotations } from "../project/annotations";
import { recipes } from "../recipes/registry";
import { workspaceStats } from "./workspace-data";
import "./starter.css";

const ComponentCatalog = lazy(() => import("./catalog/ComponentCatalog"));
const DesignSystem = lazy(() => import("./DesignSystem"));
const PrototypeStage = lazy(() => import("./PrototypeStage"));
const navigation = [
  { id: "overview", title: "原型目录" },
  { id: "starter", title: "桌面原型" },
  { id: "tokens", title: "设计系统" },
  { id: "components", title: "组件预览" },
  { id: "recipes", title: "拼接源码" },
];
function currentPage() {
  const page = location.hash.slice(1).split("/")[0];
  return navigation.some(item => item.id === page) ? page : "overview";
}

export default function StarterApp() {
  const [page, setPage] = useState(currentPage);
  const [recipeId, setRecipeId] = useState(recipes[0].id);
  const recipe = recipes.find(item => item.id === recipeId) ?? recipes[0];
  const Recipe = recipe.Page;
  const [prototypeMounted, setPrototypeMounted] = useState(() => currentPage() === "starter");
  useEffect(() => {
    function sync() { const next = currentPage(); setPage(next); if (next === "starter") setPrototypeMounted(true); }
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => { document.title = projectConfig.name; }, []);
  return <>
    {prototypeMounted && <div hidden={page !== "starter"}><Suspense fallback={<p role="status">加载画布…</p>}><PrototypeStage src="/?prototype=starter#starter" title={projectConfig.pages[0].title} page="starter" active={page === "starter"} rules={projectAnnotations} storageKey={`${projectConfig.id}.developer-annotations.v1`} designUrl={projectConfig.designUrl}/></Suspense></div>}
    {page !== "starter" && <div className="starter-workbench"><header className="starter-workbench-header"><h1>{projectConfig.name}</h1><nav aria-label="工作台导航">{navigation.map(item => <Button asChild variant={page === item.id ? "secondary" : "ghost"} key={item.id}><a href={`#${item.id}`} aria-current={page === item.id ? "page" : undefined}>{item.title}</a></Button>)}</nav></header><main className="starter-workbench-content">
      {page === "overview" && <div className="starter-overview"><section><h2>桌面原型</h2><p>打开桌面应用外壳，体验会话搜索、筛选、独立草稿和本地文本发送。</p><Button asChild><a href="#starter">打开桌面原型</a></Button></section><section><h2>组件拼接示例</h2><p>在工作台运行列表与详情、表单与弹窗、消息流与输入，并查看同一份运行源码。</p><Button asChild variant="outline"><a href="#recipes">打开拼接示例</a></Button></section><section><h2>基础资产</h2><p>{workspaceStats.atoms} 个原子家族、{workspaceStats.blocks} 个 Block 家族及对应演示，含设计变量、字体和正式图标。</p></section></div>}
      {page === "components" && <Suspense fallback={<p role="status">加载组件目录…</p>}><ComponentCatalog/></Suspense>}
      {page === "tokens" && <Suspense fallback={<p role="status">加载设计系统…</p>}><DesignSystem/></Suspense>}
      {page === "recipes" && <div className="starter-overview">
        <h2>组件拼接示例</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="选择拼接示例">{recipes.map(item => <Button key={item.id} variant={item.id === recipe.id ? "secondary" : "outline"} aria-pressed={item.id === recipe.id} onClick={() => setRecipeId(item.id)}>{item.title}</Button>)}</div>
        <div className="starter-recipe-preview" aria-label={recipe.title}><Suspense fallback={<p role="status">加载示例…</p>}><Recipe key={recipe.id}/></Suspense></div>
        {recipe.sources.map(({ file, code }) => <div key={file}><h3>{file}</h3><pre className="starter-source"><code>{code}</code></pre></div>)}
      </div>}
    </main></div>}
  </>;
}
