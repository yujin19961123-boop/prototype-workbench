# 组件拼接契约

- ui 负责单个控件行为与外观，Block 负责可复用组合；src/project 只提供页面数据、状态、事件和公开插槽。
- 先在组件目录查看实际示例，再读最接近的运行源码，不把示例当新增业务授权。
- 使用 Button / IconButton / CommandButton、Input / SearchField、FormField、Dialog / ModalFormLayout、AsyncState 与 ListDetailLayout；不在页面选择器覆盖它们的内部样式。
- Mail/Email 命名的输入字段仅负责纯 UI 策略注入；不自带原邮件工程的域名识别或账户状态。
- 所有登记组件都有独立源码演示，但视觉仍继承 pending 状态，目录覆盖不代表视觉或交互通过。
- 变化先扩展组件公开变体，不让权限变化把同一工具栏改成另一套控件。
- 此处的组件资产清单由 catalog 驱动；新增导出需登记并演示。保持桌面 / 移动与原子 / Block 的分类。
