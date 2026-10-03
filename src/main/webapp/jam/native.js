/** Gatherboard adaptations to the original draw.io EditorUi. Apache-2.0. */
Draw.loadPlugin(function(ui)
{
    'use strict';
    var graph = ui.editor.graph;
    var sidebar = ui.sidebar;
    document.body.classList.add('jam-native');

    // The grid and snap interval belong to draw.io. Do not paint a CSS grid or
    // introduce a separate screen-to-model coordinate system.
    graph.setGridSize(20);
    graph.view.gridSteps = 1;
    graph.view.gridColor = '#e4e2e7';
    graph.view.validateBackground();

    // Keep the original scratchpad storage, library management and drag source.
    if (ui.isScratchpadEnabled() && ui.scratchpad == null) ui.toggleScratchpad();

    var common = 'whiteSpace=wrap;html=1;fontFamily=Arial;fontSize=18;' +
        'fontColor=#29252D;spacing=16;align=center;verticalAlign=middle;';
    var templates = [
        ['便签', common + 'rounded=0;strokeColor=none;fillColor=#FFE299;', 200, 200, '写下一个想法'],
        ['粉色便签', common + 'rounded=0;strokeColor=none;fillColor=#F8C8DA;', 200, 200, ''],
        ['紫色便签', common + 'rounded=0;strokeColor=none;fillColor=#D9C9F5;', 200, 200, ''],
        ['圆角矩形', common + 'rounded=1;absoluteArcSize=1;arcSize=12;strokeColor=#81738F;fillColor=#D9C9F5;', 200, 120, ''],
        ['圆形', common + 'ellipse;strokeColor=#81738F;fillColor=#C7E9CA;', 160, 160, ''],
        ['菱形', common + 'rhombus;strokeColor=#81738F;fillColor=#BDDDF9;', 200, 160, ''],
        ['文字', 'text;html=1;whiteSpace=wrap;align=left;verticalAlign=middle;fontFamily=Arial;fontSize=24;fontColor=#29252D;strokeColor=none;fillColor=none;', 240, 60, '写点什么…'],
        ['分区', common + 'swimlane;horizontal=1;startSize=40;rounded=1;absoluteArcSize=1;arcSize=12;container=1;collapsible=0;recursiveResize=0;fillColor=#F1EFF5;swimlaneFillColor=#FAF9FC;strokeColor=#D5D0DD;align=left;', 640, 400, '新的分区']
    ];
    function entry(item)
    {
        return sidebar.createVertexTemplateEntry(item[1], item[2], item[3], item[4], item[0], true, false);
    }
    sidebar.addPaletteFunctions('jam', '白板组件', true, templates.map(entry));

    // Bottom dock reuses the exact Sidebar template factory (mxDragSource,
    // preview offset, scroll/zoom conversion, snapping and native undo).
    var dock = document.createElement('div');
    dock.className = 'jam-native-dock';
    dock.setAttribute('aria-label', '白板组件工具栏');
    var label = document.createElement('span');
    label.className = 'jam-dock-label';
    label.textContent = '拖入画布';
    dock.appendChild(label);
    [templates[0], templates[3], templates[4], templates[5], templates[6], templates[7]].forEach(function(item)
    {
        var holder = document.createElement('div');
        holder.className = 'jam-native-tool';
        holder.title = item[0];
        holder.appendChild(entry(item)());
        var caption = document.createElement('span');
        caption.textContent = item[0];
        holder.appendChild(caption);
        dock.appendChild(holder);
    });
    var line = document.createElement('div');
    line.className = 'jam-native-tool';
    line.title = '连线';
    line.appendChild(sidebar.createEdgeTemplateEntry('edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#81738F;strokeWidth=2;endArrow=block;html=1;', 160, 0, '', '连线', true)());
    var lineCaption = document.createElement('span');
    lineCaption.textContent = '连线';
    line.appendChild(lineCaption);
    dock.appendChild(line);
    var library = document.createElement('button');
    library.className = 'jam-library-button';
    library.textContent = '图形库';
    library.title = '图形库与 Scratchpad';
    library.onclick = function() { ui.showSidebar(); };
    dock.appendChild(library);
    document.body.appendChild(dock);
    if (ui.sketchMainMenuElt) {
        ui.sketchMainMenuElt.classList.add('jam-main-menu');
        var title = document.createElement('span');
        title.className = 'jam-file-title';
        function updateTitle() { var file = ui.getCurrentFile(); title.textContent = 'Gatherboard · ' + (file ? file.getTitle() : '未命名白板'); }
        ui.sketchMainMenuElt.appendChild(title);
        ui.addListener('fileDescriptorChanged', updateTitle);
        ui.editor.addListener('fileLoaded', updateTitle);
        updateTitle();
        var save = document.createElement('button');
        save.className = 'jam-native-save';
        save.textContent = '保存白板';
        save.onclick = function() { ui.actions.get('save').funct(); };
        document.body.appendChild(save);
    }

    // Keep native file menus, custom libraries, formatting and scratchpad.
    // No replacement save system, clipboard, graph handler or model codec.
    var freehand = ui.actions.get('insertFreehand');
    if (freehand) { freehand.isEnabled = function() { return false; }; freehand.setEnabled(false); freehand.funct = function() {}; }
    Array.prototype.forEach.call(ui.toolbar.container.querySelectorAll('a'), function(a) {
        if ((a.getAttribute('title') || '').indexOf(mxResources.get('freehand')) === 0) a.style.display = 'none';
    });
    ui.toggleFormatPanel(false);
    var jamPalette = sidebar.palettes.jam;
    var generalPalette = sidebar.palettes.general;
    if (jamPalette && generalPalette) jamPalette.forEach(function(el) {
        generalPalette[0].parentNode.insertBefore(el, generalPalette[0]);
    });

    // A prior prototype draft must remain recoverable without being silently
    // imported into / overwriting a native draw.io file.
    var legacyDraft = null;
    try { legacyDraft = localStorage.getItem('jam.draft.v1'); } catch (e) { /* Storage is optional. */ }
    if (legacyDraft)
    {
        var recover = document.createElement('button');
        recover.className = 'jam-recover';
        recover.textContent = '下载旧版草稿';
        recover.onclick = function()
        {
            var url = URL.createObjectURL(new Blob([legacyDraft], {type: 'application/xml'}));
            var a = document.createElement('a');
            a.href = url;
            a.download = 'jam-previous-draft.drawio';
            a.click();
            setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
        };
        document.body.appendChild(recover);
    }
});
