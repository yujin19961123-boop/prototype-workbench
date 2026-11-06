# 公司原型工作台 · 最小母版试用版

从公司产品工程提取的 Vite + React + TypeScript + shadcn/ui + Tailwind 底座。
项目已包含工作台、桌面 IM 和三种拼接示例。移动分类提供组件预览。

## 独立启动

使用当前支持 Node 24 的环境和 npm，进入本目录：

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:5174 。不会启动原 teleMail 的 5173 端口。

- `#starter`：可调尺寸的桌面画布，默认进入基础 IM，保留应用侧边栏。
- `#components`：组件实际演示、状态及真实源码；保留桌面 / 移动、原子 / Block 分类。
- `#tokens`：继承的公司设计变量、视觉角色及冻结边界。
- `#recipes`：运行列表与详情、表单与弹窗、消息流与输入，并查看实际源码。

## 新项目修改入口

- 项目名称、设计稿链接：`src/project.config.ts`。
- 桌面应用登记：`src/project/desktop-apps.ts`。首项为默认应用。
- 桌面应用编排：`src/project/PrototypeApp.tsx`。基础 IM 入口和模拟数据位于 `src/project/IMPage.tsx` 和 `src/project/im-model.ts`。
- 业务标注：`src/project/annotations.ts`，默认空数组，仅在用户明确要求时添加。
- 全局视觉：修改 `src/design-system/tokens.json` 后运行 `npm run tokens:generate`；不手改生成 CSS。
- 组件行为、外观和公开插槽：`src/components`。先看独立预览，再组合页面。

`workbench.manifest.json` 记录导出版本、来源 commit 和文件 SHA-256，区分项目文件与上游文件。拿到新版发布目录后运行 `npm run workbench:upgrade -- --from <版本目录>` 预演。检查变更后，用同一组参数追加 `--apply <计划 ID>` 应用。冲突可逐项选择 `--keep-local <相对路径>` 或 `--take-upstream <相对路径>` 后重新预演。

## 验收

执行 `npm run build` 检查变量、基线、组件目录、用法、类型和生产构建。
自行检查 IM 的搜索和筛选。在两个会话分别输入草稿，发送其中一条，再打开拼接示例并返回桌面原型，确认另一条草稿保留。另检查拼接示例的搜索空态、弹窗取消与保存、消息输入，以及画布操作和空标注列表。视觉由用户验收。

当前依赖版本及 lockfile 沿用来源工程，不在提取时升级，也暂不裁剪运行依赖。正式 SVG 和字体沿用原路径，其中 `public/icons/email` 是已有资产命名空间，不代表加载邮件业务。

母版和参考项目分别运行。需要参考 teleMail 时，由母版维护者在初始化向导里选择附带参考包。
