# Email 单图标 SVG 导出包

来源：Email 文件 / APP / Mail · Assets and References / Email图标（2991:3015）。
导出日期：2026-10-31。共 288 个独立 SVG。Figma 原文件未修改。

## 优先分类
01-app-bar：应用栏；02-folders：文件夹；03-home-view：Home / View；
04-context-menu：右键菜单；05-selection-state：选择/状态；06-editor-tools：编辑工具。

## 查看方式
- overview-all.png：全部图标与完整文件名总览图。
- overviews/：按分类拆分的总览图，便于放大阅读。
- overview.html：本地可搜索总览，预览与单图标下载。
- icon-catalog.csv：UTF-8 BOM 对照表，可用 Excel 打开。
- color-rules.csv：颜色语义与保留规则。
- manifest.json：逐项源节点、源尺寸、导出尺寸、版本、颜色与来源链接。
- validation.json：逐项 SVG 渲染、透明度及非空检查结果。

## 文件命名
mail-{用途}-{outline|filled}[-active|-disabled]-{尺寸}[-序号].svg
例如 mail-delete-outline-20.svg。
方形用 20、24、14 等原始尺寸；非方形用 10x6。
同用途、尺寸、版本在多个工具栏重复出现时，用 -02、-03 保留独立源图层，不覆盖。

## 尺寸与透明背景
不统一缩放为 16px，不紧裁 20px / 24px 图标的留白，不将整页作为单个 SVG。
下拉箭头的源局部节点为 6×10、包含旋转，原生导出可见画布为 10×6；CSV 同时记录两种尺寸。
8×6 的圆角三角形因原生导出裁掉空白，已仅补回透明画布，路径未改、未缩放。
透明背景并不意味着删除图形内部的白色填充、掩模或品牌/状态底形。
总览图的棋盘格不是 SVG 的一部分。

## 视觉保真
使用 Figma 原生 SVG 导出，svgSimplifyStroke=false，未做路径优化、线宽归一或颜色替换。
线框图标可能以封闭填充路径呈现，这是源设计/原生导出的描边轮廓表达方式；视觉描边效果保留。
所有原始填充、描边、裁剪、掩模、渐变与透明度保留。多色及品牌图标保持原色，不强改 currentColor。
仅导出画板已有版本，没有自动生成未设计的线框、填充或禁用图标。
active 依据已有蓝/绿色强调版本；disabled 只用于来源中可明确识别的弱化版本，普通灰色图标不一概视为禁用。

## 用途判定
原图有功能文字的，按原标签命名。
原图无语义标签、只有 Group/Vector 名称的，按图形和所在分组推定，CSV 标记“请结合业务确认”。
没有把文字标签、分隔线、色板样本和零尺寸空图层当成图标导出。
