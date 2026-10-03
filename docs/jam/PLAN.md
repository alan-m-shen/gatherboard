# 修正后的实现路线

用户指出最初方案绕过了 draw.io 自带的能力。该反馈成立：下载源码后另建只实例化 mxGraph 的页面，不符合“在 draw.io 上改”的要求。现撤回这条路线。

采用原生 App / EditorUi + 原生 Sketch 主题 + DRAWIO_CONFIG + CSS + 官方插件回调。只为组件快捷入口和主题外观写薄层适配。文件读写、图形库、Scratchpad、图形拖动、模型、撤销、格式编辑全部继续使用 draw.io。

网格配置：defaultGridSize=20、gridSteps=1、defaultGridEnabled=true。gridSteps 是网格主次分级参数，不是背景装饰。原生 renderer 同时管理视图缩放和网格原点；不额外叠加 CSS 点阵。

拖放：废弃 HTML5 draggable 加手写 clientX/clientY 转换路径，底部与侧栏统一使用原生 Sidebar template factory。此前路径未复用原生 preview anchor、滚动偏移和 view transform；未保留完整旧版复现日志，因此不把单一偏移公式宣称为已独立证实的唯一根因。修正以原生路径的实际落点测试为准。

视觉：以 FigJam 官方界面截图的浮动菜单、底部组件栏、右下缩放、浅色图形和紫色强调为参照。通过原生 Sketch 主题和 CSS 实现；圆角、字体、颜色保持原生 cell style。当前网格按用户要求采用原生均匀单层线网格，没有另造点阵绘制器。

- 官方参考：https://help.figma.com/hc/en-us/articles/15300412458647-Explore-FigJam-files
- 官方界面截图：https://help.figma.com/hc/article_attachments/34612820395671
- 原生配置实现：`src/main/webapp/js/diagramly/Editor.js` 的 `Editor.configure`
- 官方插件生命周期：`src/main/webapp/js/diagramly/App.js` 的 `initPluginCallback` / `Draw.loadPlugin`
- 原生图形库拖入：`src/main/webapp/js/grapheditor/Sidebar.js`

后续验证仍包括手机真机、更多缩放组合、不同图形库和复杂容器。不要沿用首版独立编辑器测试数量作为新版通过证据。不要把样式方向调整描述成与 FigJam 已逐像素一致。
