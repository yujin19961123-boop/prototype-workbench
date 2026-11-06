import { useEffect, useState, type CSSProperties } from "react";
import tokens from "@/design-system/tokens.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { WorkCard } from "@/components/blocks/work-card";
import { Copy, ArrowRight } from "lucide-react";
import { isFrozenRole, layerRoles, visualReviewLabel, workspaceStats } from "./workspace-data";

function RoleStatus({ path }: { path: string }) {
  const frozen = isFrozenRole(path);
  return <span data-role-path={path} data-frozen={frozen} className="inline-block rounded border px-2 py-0.5 text-caption text-muted-foreground">
    {frozen ? `已冻结 v${workspaceStats.version}` : "扩展 · 可迭代"}
  </span>;
}

export default function DesignSystem() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setValues(
      Object.fromEntries(
        Object.keys(tokens.tokens).map((name) => [
          name,
          style.getPropertyValue(name).trim(),
        ]),
      ),
    );
  }, []);
  async function copy(name: string) {
    try {
      await navigator.clipboard.writeText(`var(${name})`);
      setNotice(`已复制 var(${name})`);
    } catch {
      setNotice("复制失败，可直接选中变量名称复制。");
    }
  }
  const panel = "flex flex-col overflow-hidden rounded-xl border bg-card";
  const heading = "flex items-center gap-3 border-b border-dashed p-4";
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-5 lg:p-6">
        <p className="font-mono text-[10px] tracking-[.18em] text-muted-foreground">
          02 · TOKENS · 全局设计变量
        </p>
        <h2 className="mt-3 text-title-2">
          一套变量 ·{" "}
          <span className="text-action-outline-text">
            串起原子 / Block / 页面
          </span>
        </h2>
        <p className="mt-3 text-caption text-muted-foreground">
          基础规范 v{workspaceStats.version} 的 {workspaceStats.frozen} 个限定条目已冻结，{visualReviewLabel}。下方按具体角色标识状态；扩展角色、页面布局与业务 Block API 继续迭代。Poppins 为正式字体。
        </p>
        <p className="mt-3 text-caption text-muted-foreground">“已冻结”来自基础规范清单中的精确条目；引用冻结基础值的扩展角色，不自动视为该角色也已冻结。</p>
        <div className="mt-5 grid items-stretch gap-4 border-t border-dashed pt-5 lg:grid-cols-3">
          <section className={panel}>
            <div className={heading}>
              <span className="grid size-7 place-items-center rounded-lg bg-primary font-serif text-lg italic text-primary-foreground">
                a
              </span>
              <div>
                <h3 className="text-sm font-semibold">颜色 · COLOR</h3>
                <p className="text-[10px] text-muted-foreground">
                  6 语义色 · 各 5 阶
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2 bg-muted/30 p-3">
              {Object.entries(tokens.palettes).map(([name, palette]) => (
                <div key={name} className="rounded-lg border bg-card p-3">
                  <button
                    type="button"
                    onClick={() => copy(`--palette-${name}-500`)}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <span
                        className="size-3 rounded-sm"
                        style={{ background: `var(--palette-${name}-500)` }}
                      />
                      {name}
                    </span>
                    <code className="text-[9px] text-muted-foreground">
                      {palette.steps["500"]}
                    </code>
                  </button>
                  <div className="mt-2 flex gap-1">
                    {Object.entries(palette.steps).map(([step, value]) => (
                      <button
                        type="button"
                        key={step}
                        onClick={() => copy(`--palette-${name}-${step}`)}
                        aria-label={`复制 ${name}-${step} ${value}`}
                        title={`${name}-${step} · ${value} · ${isFrozenRole(`palettes.${name}.steps.${step}`) ? "已冻结" : "扩展 · 可迭代"}`}
                        className="h-3 min-w-0 flex-1 rounded-sm border border-black/5"
                        style={{ background: `var(--palette-${name}-${step})` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.keys(palette.steps).map(step => <span key={step} className="flex items-center gap-1 text-caption"><span>{step}</span><RoleStatus path={`palettes.${name}.steps.${step}`} /></span>)}
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {palette.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className={panel}>
            <div className={heading}>
              <span className="grid size-7 place-items-center rounded-lg bg-primary font-serif text-lg italic text-primary-foreground">
                b
              </span>
              <div>
                <h3 className="text-sm font-semibold">字号 · TYPE</h3>
                <p className="text-[10px] text-muted-foreground">
                  {Object.keys(tokens.type).length} 个角色 · 字号 / 行高 / 字重
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-3 bg-muted/30 p-3">
              {Object.entries(tokens.type).map(([name, type]) => (
                <div key={name} className="rounded-lg border bg-card p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      style={
                        {
                          fontSize: `var(--type-${name}-size)`,
                          lineHeight: `var(--type-${name}-line)`,
                          fontWeight: `var(--type-${name}-weight)`,
                        } as CSSProperties
                      }
                    >
                      Aa <span className="text-xs">{name}</span>
                    </span>
                    <code className="text-[10px] text-muted-foreground">
                      {type.size} / {type.line}
                    </code>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {type.label} · {type.weight}
                  </p>
                  <div className="mt-2"><RoleStatus path={`type.${name}`} /></div>
                </div>
              ))}
              <p className="px-1 pt-2 text-xs leading-6 text-muted-foreground">
                字体：Poppins 400 / 500 / 600 本地加载，中文回退 Microsoft YaHei。邮件原文可保留自身排版。
              </p>
              <div className="rounded-lg border bg-card p-3">
                <code className="text-[10px] text-muted-foreground">
                  --font-ui
                </code>
                <p className="mt-2 text-body">正文示例：邮件主题与内容。</p>
                <p className="mt-2 text-caption text-muted-foreground">
                  辅助示例：时间、摘要与说明。
                </p>
              </div>
            </div>
          </section>
          <section className={panel}>
            <div className={heading}>
              <span className="grid size-7 place-items-center rounded-lg bg-primary font-serif text-lg italic text-primary-foreground">
                c
              </span>
              <div>
                <h3 className="text-sm font-semibold">间距 / 圆角 · SPACING</h3>
                <p className="text-[10px] text-muted-foreground">
                  4px 基础 · 8px 布局节奏
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-3 bg-muted/30 p-3">
              {["1", "2", "4", "6", "8", "12"].map((step) => (
                <div
                  key={step}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3"
                >
                  <span className="flex items-center gap-3 text-xs">
                    <span
                      className="h-1.5 rounded-sm bg-primary"
                      style={{ width: `var(--space-${step})` }}
                    />
                    sp-{step}
                  </span>
                  <code className="text-[10px] text-muted-foreground">
                    {tokens.spacing[step as keyof typeof tokens.spacing]} px
                  </code>
                  <RoleStatus path={`spacing.${step}`} />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {["md", "lg", "full"].map((name) => (
                  <div
                    key={name}
                    className="rounded-lg border bg-card p-3 text-center"
                  >
                    <div
                      className="mx-auto mb-2 size-8 border border-brand-green bg-upload-background"
                      style={{ borderRadius: `var(--curve-${name})` }}
                    />
                    <code className="text-[9px] text-muted-foreground">
                      {name} · {tokens.radii[name as keyof typeof tokens.radii]}
                    </code>
                    <div className="mt-2"><RoleStatus path={`radii.${name}`} /></div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] leading-5 text-muted-foreground">
                角色覆盖：事项卡片 8px、详情 12px、菜单 16px、联系人摘要
                20px、资料卡 24px、控件胶囊。
              </p>
            </div>
          </section>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-title-2">控件尺寸与状态</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["默认按钮", "--button-height"],
              ["普通输入", "--input-height"],
              ["筛选项", "--control-height"],
              ["搜索框", "--search-height"],
              ["列表行", "--list-row-height"],
              ["头像", "--avatar-size"],
            ].map(([label, name]) => (
              <div key={name} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-mono text-sm">{values[name] || "…"}</p>
                <div className="mt-2"><RoleStatus path={`tokens.${name}`} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              onClick={() =>
                setNotice("按钮读取全局 primary、字号、间距、尺寸与圆角。")
              }
            >
              全局主操作
            </Button>
            <Button variant="outline">描边操作</Button>
            <Button disabled>禁用状态</Button>
          </div>
          <Input
            className="mt-4"
            aria-label="设计系统输入样本"
            placeholder="输入框读取全局字体、边框、尺寸和圆角"
          />
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            键盘焦点使用深绿色 2px 轮廓，禁用透明度 50%。移动触控热区 44px
            为适配建议，尚未统一应用到移动产品布局。
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-title-2">变量如何贯穿页面</h2>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {["基础刻度", "语义变量", "原子组件", "Block", "页面"].map(
              (name, i) => (
                <span key={name} className="inline-flex items-center gap-2">
                  <span className="rounded bg-muted px-2 py-1">{name}</span>
                  {i < 4 && <ArrowRight size={12} />}
                </span>
              ),
            )}
          </div>
          <div className="mt-6">
            <WorkCard
              title="同一套变量驱动的组合组件"
              progress={{ value: 50, label: "1 / 2" }}
              status={<StatusPill tone="success">语义状态样本</StatusPill>}
            />
          </div>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            修改 tokens.json，生成 CSS 后，Tailwind
            工具类、基础控件和组合组件同步读取。页面使用已有组件，不重新定义品牌色、字号或控件圆角。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href="#components/desktop/atoms/button">查看原子组件</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#components/desktop/blocks/work-card">查看 Block</a>
            </Button>
          </div>
          <div className="mt-5 rounded-lg border p-3 text-xs text-muted-foreground">
            <h3 className="font-medium text-foreground">浮层层级</h3>
            <ul className="mt-3 space-y-3" aria-label="浮层层级清单">{layerRoles.map(layer => <li key={layer.name} className="flex flex-wrap items-center justify-between gap-2">
              <span>{layer.label} · <code>{layer.value}</code></span><RoleStatus path={`tokens.${layer.name}`} />
            </li>)}</ul>
            <p className="mt-3">动效：{tokens.tokens["--motion-fast"]} / {tokens.tokens["--motion-normal"]}。</p>
            <p className="mt-2">系统开启减少动态效果时，通用过渡时长归零。</p>
          </div>
        </div>
      </section>
      <details className="rounded-xl border bg-card p-5">
        <summary className="cursor-pointer text-body font-semibold">完整基础尺寸、间距与圆角</summary>
        <div className="mt-5 space-y-5">{([
          ["sizes", "尺寸", tokens.sizes], ["spacing", "间距", tokens.spacing], ["radii", "圆角", tokens.radii],
        ] as const).map(([group, title, roles]) => <div key={group} className="overflow-x-auto">
          <h3 className="mb-3 text-body font-medium">{title}</h3>
          <table className="w-full text-left text-caption">
            <thead><tr className="border-b text-muted-foreground"><th className="p-2 font-normal">基础角色</th><th className="p-2 font-normal">当前值</th><th className="p-2 font-normal">维护状态</th></tr></thead>
            <tbody>{Object.entries(roles).map(([name, value]) => <tr key={name} className="border-b last:border-0">
              <td className="p-2 font-mono">{name}</td><td className="p-2">{value}px</td><td className="p-2"><RoleStatus path={`${group}.${name}`} /></td>
            </tr>)}</tbody>
          </table>
        </div>)}</div>
      </details>
      <details className="rounded-xl border bg-card p-5">
        <summary className="cursor-pointer text-sm font-semibold">
          全部语义与组件变量 · {Object.keys(tokens.tokens).length} 项
        </summary>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="p-2 font-normal">变量</th>
                <th className="p-2 font-normal">绑定</th>
                <th className="p-2 font-normal">当前生效值</th>
                <th className="p-2 font-normal">维护状态</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tokens.tokens).map(([name, value]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="whitespace-nowrap p-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 font-mono"
                      onClick={() => copy(name)}
                    >
                      <Copy size={11} />
                      {name}
                    </button>
                  </td>
                  <td className="p-2 font-mono text-[10px] text-muted-foreground">
                    {value}
                  </td>
                  <td className="p-2 font-mono text-[10px]">
                    {values[name] || "…"}
                  </td>
                  <td className="p-2"><RoleStatus path={`tokens.${name}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p role="status" className="min-h-5 text-xs text-action-outline-text">
        {notice}
      </p>
    </div>
  );
}
