import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Monitor,
  Search,
  Smartphone,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  entries,
  sourcePath,
  loadSource,
  loadExample,
  exampleBody,
  catalogHash,
  type Device,
  type Kind,
} from "./registry";
import { componentExports } from "./source";

function readSelection() {
  const [, rawDevice, rawKind, id] = location.hash.slice(1).split("/");
  const device: Device = rawDevice === "mobile" ? "mobile" : "desktop";
  const kind: Kind = rawKind === "blocks" ? "blocks" : "atoms";
  const available = entries.filter(
    (entry) =>
      entry.kind === kind &&
      (entry.platform === "shared" || entry.platform === device),
  );
  return {
    device,
    kind,
    entry:
      available.find((entry) => entry.id === id) ??
      available.find((entry) => entry.id === "input") ??
      available[0],
    available,
  };
}

export default function ComponentCatalog() {
  const [selection, setSelection] = useState(readSelection);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"example" | "source">("example");
  const [expanded, setExpanded] = useState(false);
  const [source, setSource] = useState("");
  const [example, setExample] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const { device, kind, entry, available } = selection;
  const group = useRef(`${device}/${kind}`);
  useEffect(() => {
    const sync = () => {
      const next = readSelection(), nextGroup = `${next.device}/${next.kind}`;
      if (nextGroup !== group.current) setSearch("");
      group.current = nextGroup;
      setSelection(next);
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    setSource("");
    window.scrollTo({ top: 0 });
    setExample("");
    setSourceError("");
    setCopyStatus("");
    setExpanded(false);
    if (!entry) return;
    let current = true;
    Promise.all([loadSource(entry), loadExample(entry)])
      .then(([code, demo]) => {
        if (current) {
          setSource(code);
          setExample(exampleBody(demo, entry));
        }
      })
      .catch(() => {
        if (current) setSourceError("源码加载失败，请刷新重试。");
      });
    return () => {
      current = false;
    };
  }, [entry]);
  const filtered = available.filter((item) =>
    `${item.title} ${item.description} ${item.id}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const index = filtered.findIndex((item) => item.id === entry?.id);
  const code = mode === "source" ? source : example;
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("已复制");
    } catch {
      setCopyStatus("复制失败，请展开源码后手动选择复制。");
    }
  }
  function switchGroup(nextDevice: Device, nextKind: Kind) {
    const matches = entries.filter(
      (item) =>
        item.kind === nextKind &&
        (item.platform === "shared" || item.platform === nextDevice),
    );
    const next = matches.find((item) => item.id === entry?.id) ?? matches[0];
    if (next) location.hash = catalogHash(nextDevice, nextKind, next.id);
  }
  return (
    <div className="catalog-page rounded-xl border bg-card text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <h1 className="text-section-title">组件预览</h1>
        <span className="text-caption text-muted-foreground">
          {entries.length} 个组件页 · 原子 / Block
        </span>
      </header>
      <div className="grid lg:grid-cols-[200px_minmax(0,1fr)] 2xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="catalog-sidebar border-b bg-card p-4 lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-32px)] lg:flex-col lg:overflow-hidden lg:border-b-0 lg:border-r">
          <div
            className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
            aria-label="按终端分类"
          >
            {(
              [
                { id: "desktop", label: "桌面端", Icon: Monitor },
                { id: "mobile", label: "移动端", Icon: Smartphone },
              ] as const
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={device === id}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs ${device === id ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
                onClick={() => switchGroup(id, kind)}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <div
            className="mb-4 grid grid-cols-2 gap-2"
            aria-label="按组件层级分类"
          >
            {(
              [
                { id: "atoms", label: "原子组件" },
                { id: "blocks", label: "Block 组件" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={kind === id}
                className={`rounded-md border px-2 py-2 text-xs ${kind === id ? "border-primary bg-secondary text-action-outline-text" : "border-border text-muted-foreground"}`}
                onClick={() => switchGroup(device, id)}
              >
                {label}{" "}
                <span className="ml-1 opacity-60">
                  {
                    entries.filter(
                      (item) =>
                        item.kind === id &&
                        (item.platform === "shared" ||
                          item.platform === device),
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <label className="relative mb-5 block">
            <Search
              size={14}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <input
              aria-label="搜索组件目录"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索组件…"
              className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <p role="status" aria-live="polite" className="mb-3 px-2 text-caption text-muted-foreground">{filtered.length} / {available.length} 个组件</p>
          <p className="mb-2 px-2 text-[10px] font-medium tracking-widest text-muted-foreground">
            {device === "desktop" ? "DESKTOP" : "MOBILE"} /{" "}
            {kind === "atoms" ? "ATOMS" : "BLOCKS"}
          </p>
          <nav
            aria-label="组件目录"
            className="catalog-links grid auto-rows-min max-h-64 gap-0.5 overflow-y-auto lg:min-h-0 lg:max-h-none lg:flex-1"
          >
            {filtered.map((item) => (
              <a
                key={item.id}
                href={catalogHash(device, kind, item.id)}
                aria-current={entry?.id === item.id ? "page" : undefined}
                className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-[13px] ${entry?.id === item.id ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted"}`}
              >
                <span>{item.title}</span>
                {item.platform === "shared" && (
                  <span className="text-[9px] font-normal text-muted-foreground">
                    通用
                  </span>
                )}
              </a>
            ))}
            {!filtered.length && (
              <p role="status" className="px-3 py-6 text-xs text-muted-foreground">
                没有匹配组件。
              </p>
            )}
          </nav>
          {device === "mobile" && (
            <p className="mt-5 border-t pt-4 text-[11px] leading-5 text-muted-foreground">
              目前没有移动专用组件。这里展示通用组件的 375px
              独立视口预览，不代表移动产品设计已确认。
            </p>
          )}
        </aside>
        <div className="min-w-0 px-5 py-6 lg:px-6">
          {entry ? (
            <article className="mx-auto max-w-[900px]">
              <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {device === "desktop" ? "桌面端" : "移动端"} /{" "}
                    {kind === "atoms" ? "原子组件" : "Block 组件"}
                  </p>
                  <h2 className="text-title-1 font-semibold tracking-tight">
                    {entry.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                    {entry.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{{ candidate: "待场景验证", adapted: "产品适配", pattern: "组合范式" }[entry.maturity ?? "candidate"]} · {entry.visualReview === "accepted" ? "视觉已验收" : "视觉待验收"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`/?preview=${encodeURIComponent(entry.id)}&device=${device}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-2 rounded-md border px-3 text-caption text-action-outline-text hover:bg-muted"
                    aria-label="独立预览（新窗口）"><ExternalLink size={14} />独立预览</a>
                  <button
                    type="button"
                    disabled={!example}
                    className="flex h-8 items-center gap-2 rounded-md bg-muted px-3 text-xs disabled:opacity-40"
                    onClick={() =>
                      copy(
                        `# ${entry.title}\n\n${entry.description}\n\n源码：${sourcePath(entry)}\n\n\u0060\u0060\u0060tsx\n${example}\n\u0060\u0060\u0060`,
                      )
                    }
                  >
                    <Copy size={13} />
                    复制页面
                  </button>
                  <button
                    type="button"
                    disabled={index <= 0}
                    aria-label="上一个组件"
                    className="grid size-8 place-items-center rounded-md bg-muted disabled:opacity-30"
                    onClick={() => {
                      location.hash = catalogHash(
                        device,
                        kind,
                        filtered[index - 1].id,
                      );
                    }}
                  >
                    <ArrowLeft size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={!filtered.length || index >= filtered.length - 1}
                    aria-label="下一个组件"
                    className="grid size-8 place-items-center rounded-md bg-muted disabled:opacity-30"
                    onClick={() => {
                      location.hash = catalogHash(
                        device,
                        kind,
                        filtered[index + 1].id,
                      );
                    }}
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div
                  className="flex gap-6"
                  role="tablist"
                  aria-label="代码内容"
                >
                  {(
                    [
                      { id: "example", label: "使用示例" },
                      { id: "source", label: "组件源码" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={mode === item.id}
                      aria-controls="catalog-code"
                      className={`border-b-2 pb-2 text-sm ${mode === item.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
                      onClick={() => setMode(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {entry.platform === "shared" ? "通用组件" : "桌面专用"} ·{" "}
                  {device === "mobile" ? "375px 视口" : "交互预览"}
                </span>
              </div>
              <section
                className="overflow-hidden rounded-2xl border border-border"
                aria-label={`${entry.title} 预览与代码`}
              >
                <div
                  className={`flex items-start justify-center bg-card ${device === "mobile" ? "bg-muted! p-5" : ""}`}
                >
                  <iframe
                    key={`${device}-${entry.id}`}
                    title={`${entry.title} ${device === "mobile" ? "移动端" : "桌面端"}交互预览`}
                    src={`/?preview=${encodeURIComponent(entry.id)}&device=${device}`}
                    className={
                      device === "mobile"
                        ? "rounded-[24px] border-[6px] border-border bg-card"
                        : "w-full border-0 bg-card"
                    }
                    style={{
                      width: device === "mobile" ? 387 : "100%",
                      maxWidth: "100%",
                      height: device === "mobile" ? 600 : Math.min(entry.height ?? 340, 420),
                    }}
                  />
                </div>
                <div
                  id="catalog-code"
                  role="tabpanel"
                  className="border-t bg-muted"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
                    <span className="flex min-w-0 items-center gap-2 truncate font-mono text-[11px] text-muted-foreground">
                      <Code2 size={13} />
                      {mode === "source"
                        ? sourcePath(entry)
                        : `${entry.demoExport} · 使用示例`}
                    </span>
                    <button
                      type="button"
                      className="shrink-0 text-xs text-muted-foreground disabled:opacity-40"
                      disabled={!code}
                      onClick={() => copy(code)}
                    >
                      复制代码
                    </button>
                  </div>
                  <div
                    className={`relative overflow-hidden ${expanded ? "" : "max-h-32"}`}
                  >
                    <pre className="overflow-x-auto p-5 text-[11px] leading-6 text-muted-foreground">
                      <code>
                        {sourceError ||
                          (code
                            ? code.split("\n").map((line, index) => (
                                <span key={index} className="block">
                                  <span
                                    className="mr-5 inline-block w-5 select-none text-right text-muted-foreground"
                                    aria-hidden="true"
                                  >
                                    {index + 1}
                                  </span>
                                  {line || " "}
                                </span>
                              ))
                            : "正在加载源码…")}
                      </code>
                    </pre>
                    {!expanded && (
                      <div className="absolute inset-x-0 bottom-0 flex h-24 items-center justify-center bg-linear-to-t from-muted via-muted/90 to-transparent">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-xs shadow-sm"
                          onClick={() => setExpanded(true)}
                        >
                          查看代码
                          <ChevronDown size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  {expanded && (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      className="m-4 rounded-md border bg-card px-3 py-1.5 text-xs"
                      onClick={() => setExpanded(false)}
                    >
                      收起代码
                    </button>
                  )}
                </div>
              </section>
              <p className="mt-3 text-caption text-muted-foreground">嵌入演示可在内部滚动，桌面预览高度最多 420px。可打开独立预览查看完整演示；此处组件样本不代表产品页面的实际尺寸。</p>
              <p
                role="status"
                className="mt-3 flex min-h-5 items-center gap-2 text-xs text-muted-foreground"
              >
                {copyStatus === "已复制" && <Check size={13} />} {copyStatus}
              </p>
              <section className="mt-8 border-t pt-5">
                <h2 className="text-sm font-medium">本页包含的组件</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {componentExports(source).map((name) => (
                    <code
                      key={name}
                      className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                    >
                      {name}
                    </code>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  组合部件在完整示例中展示；菜单、弹窗和选择列表中的部件在打开后可见。此页展示真实源码，业务行为以已确认需求为准。
                </p>
              </section>
            </article>
          ) : (
            <p role="status">当前分类没有组件。</p>
          )}
        </div>
      </div>
    </div>
  );
}
