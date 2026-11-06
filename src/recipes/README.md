# 组件拼接入口

工作台 `#recipes` 可运行三种范式，并显示实际源码。它们使用模拟数据，视觉由用户验收。

| 场景 | 先读 | 组合边界 |
| --- | --- | --- |
| 列表与详情 | `ListDetailRecipe.tsx` | 页面管理搜索和选中 ID，`ListDetailLayout` 提供区域和拖动分隔，`AsyncState` 显示空态 |
| 表单与弹窗 | `FormDialogRecipe.tsx` | 页面区分草稿和已保存值，`Dialog` 管理焦点，`ModalFormLayout` 管理正文和页脚 |
| 消息流与输入 | `../project/IMPage.tsx` 与 `../project/im-model.ts` | 页面编排会话状态，`IMWorkspace` 管理交互呈现，示例和桌面使用各自的状态实例 |

工作台范式登记在 `registry.ts`。需要新增产品应用时，使用 `../project/desktop-apps.ts` 登记侧栏入口、图标和页面组件。
