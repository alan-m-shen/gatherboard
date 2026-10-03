# Gatherboard：在原生 draw.io 上改造

当前版本已撤回最初独立 `mxGraph` 页面方案，改用完整 draw.io App / EditorUi、原生 Sketch 主题、Configuration、自定义 CSS 和官方插件入口。没有单独实现文件模型、拖动坐标换算、剪贴板或撤销系统。

## 启动

```sh
./run-gatherboard.sh
```

打开 http://127.0.0.1:8765/jam.html 。它转向原生 `/index.html?jam=1&ui=sketch&mode=browser&splash=0&lang=zh`。直接打开不含 `jam=1` 的 `/index.html` 仍是原编辑器。

## 改动位置

- `js/PreConfig.js`：`DRAWIO_CONFIG`，包含 `defaultGridSize: 20`、`gridSteps: 1`、默认图形样式、有限色板、不压缩 XML、自定义 CSS。
- `js/bootstrap.js`：在原生 App 构造前初始化官方插件回调队列；对本地定制配置加版本参数。
- `js/PostConfig.js`：加载本地插件。
- `jam/native.js`：`Draw.loadPlugin(ui)` 访问原生 EditorUi；复用 Sidebar 工厂生成组件、快捷拖入栏；启用原生 Scratchpad；移除手写入口。
- `jam/native.css`：原生界面的圆角、色彩、留白、浮动组件栏。
- `jam.html`：兼容旧地址的跳转页，已不包含独立绘图应用。

## 保留的原生能力

原生文件菜单、打开／导入／保存／导出、自定义图形库、Scratchpad、更多图形、样式面板、连接点、分组和容器、撤销／重做、复制粘贴、搜索。保存按钮调用原生 save action。分区是原生 swimlane 容器。

底部组件通过 `Sidebar.createVertexTemplateEntry` 和 `createEdgeTemplateEntry` 创建，与原生侧栏使用同一 `mxDragSource`。缩放、滚动和预览锚点不再由自写 HTML drag/drop 路径换算。

网格由 draw.io 原生 renderer 绘制；`gridSteps=1` 消除粗细主次网格，`defaultGridSize=20` 控制模型吸附间距。没有 CSS 背景网格。保持原生编辑行为，包括其键盘修饰键行为，不宣称强制不可绕过的组件约束。

旧版 `jam.draft.v1` 不自动覆盖新文件；若存在，提供“下载旧版草稿”，之后可由原生文件菜单打开。旧草稿未删除。

## 状态

已在真实浏览器检查 100% 和 50% 缩放、画布滚动后的拖放；检查 Scratchpad 收集与重新拖入。见 `docs/jam/VERIFICATION.md`。

当前视觉按 FigJam 的浮动文件菜单／底部工具栏／右下缩放／柔和便签色收敛，仍不是逐像素复刻。没有表情、手写入口。手机真机体验未验收。

Git：官方 draw.io fork：[alan-m-shen/gatherboard](https://github.com/alan-m-shen/gatherboard)。Gatherboard 使用 `main` 分支，开发基线为 `24b76c2cbd55d88e354042e8d329a2e4708972bc`。保留上游来源、历史和许可证。
