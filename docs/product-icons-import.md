# 正式图标接入记录

2026-11-02：Home 工具栏 New Email 使用现有 Lucide 的 MailPen（信封＋笔）补位。侧栏入口按用户后续参考图移到搜索框下方，改为加号及文字的整行按钮，标题右侧小入口移除。正式 compose 资源及全局映射保留。

来源：用户提供的 dist/Email-icons-export-2026-10-31，2026-10-31 接收。

原目录位于构建产物中，执行 build 会清空。已在构建前完整保存到 **public/icons/email/**，包括 288 个原始 SVG、manifest、CSV、颜色规则、交付验证数据和总览图。后续不再依赖旧 dist 路径。

## 实现

- 新增 ProductIcon 原子，按原始相对路径渲染。保留路径、颜色、透明度、遮罩、渐变和画布比例，未强改 currentColor。通过 img 隔离每个 SVG 的 ID，避免重复 clip/mask ID 冲突。
- icons.ts 接入 32 个语义明确的映射，清单在 icon-mapping.json。剩余图标继续由 Lucide 提供，不强套不相关资源。
- 文件夹 Archive / Outbox 分别使用 folder-archive / folder-upload；View 的 Conversation / Email Preview / Collapse Conversation 分别使用各自原图。
- Product Icon 预览登记为 shared 原子：六分类、文件名/用途搜索、原尺寸和放大预览，展示全部 288 个 SVG。没有顺带实现富文本编辑器业务。
- 运行时尺寸索引与完整来源信息分开加载，避免业务页面携带全部设计来源信息。

SVG 保留原色，因此不响应 color 或 strokeWidth 修改源图。禁用表现仍由控件容器处理；灰色原图不一概视为禁用。Checkbox 保留原有交互和无障碍能力，不把导出的状态图片替代为操作控件。

## 待补素材

2026-11-02 服务商图标补齐：分布式登录中的 Yahoo / iCloud 改为官方图标本地资源，IMAP / POP 改用上述正式交付的通用邮箱 SVG，Outlook / Gmail 原文件及样式不变。提供商列表、同步/等待页面共享 ProviderSymbol。来源记录在 [providers/README](../public/mail/providers/README.md)；未新增或改动 288 个正式 SVG。只检查资源与工程构建，页面视觉仍由用户验收。

01-app-bar 的实际内容大多是邮件命令，不是左侧整套应用导航。Chats、Calls、Cast、Messages 等继续使用 Lucide。Pin、Quick Steps、部分箭头与窗口按钮尚无明确对应项；品牌、提供商、搜索/筛选及空态插画仍使用既有资源。

46 个编辑器图标已归档并展示，但不改变尚未确认的写信/编辑器范围。manifest 中 visual-inference 的用途在预览中标注待核对；近似及重复版本全部保留。

## 验证与限制

- 288 个文件检查未发现 script、foreignObject、事件处理器或外部 href/src。
- 交付方 validation.json 的 288 条记录全部标记非空、渲染通过。这是交付方结果，不等于本轮重新渲染。
- 本轮逐字节检查构建后的 288 SVG 与 public 原件一致，映射路径无缺失，记录见 artifacts/icons/verification.json。
- 67 个源码、272 个组件导出覆盖检查、TypeScript 与生产构建通过。
- 本地浏览器控制此前被 Work 设置关闭，图标替换后的浏览器视觉回归尚未完成。已查看交付总览图与原 SVG，不把资源检查代替页面验证。
