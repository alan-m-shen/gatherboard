/**
 * Copyright (c) 2006-2024, JGraph Holdings Ltd
 * Copyright (c) 2006-2024, draw.io AG
 */
// Overrides of global vars need to be pre-loaded
window.DRAWIO_PUBLIC_BUILD = true;
window.EXPORT_URL = null; // Replace with the URL of your export server to enable server-side PDF and image export, e.g. https://www.example.com/export. With null, export to PDF uses the print dialog
window.DRAWIO_BASE_URL = null; // Replace with path to base of deployment, e.g. https://www.example.com/folder
window.DRAWIO_VIEWER_URL = null; // Replace your path to the viewer js, e.g. https://www.example.com/js/viewer.min.js
window.DRAWIO_LIGHTBOX_URL = null; // Replace with your lightbox URL, eg. https://www.example.com
window.DRAW_MATH_URL = 'math4/es5';
window.DRAWIO_CONFIG = null; // Replace with your custom draw.io configurations. For more details, https://www.drawio.com/doc/faq/configure-diagram-editor
urlParams['sync'] = 'manual';

// Jam is a configuration of the full draw.io editor, not a second canvas app.
if (urlParams['jam'] == '1')
{
    window.DRAWIO_CONFIG = {
        defaultGridSize: 20,
        gridSteps: 1,
        defaultGridEnabled: true,
        defaultGridColor: '#e4e2e7',
        defaultPageVisible: false,
        defaultPageBackgroundColor: '#faf9f7',
        defaultLibraries: 'general',
        defaultFonts: ['Arial', 'Helvetica', 'Verdana'],
        defaultColors: ['FFE299', 'F8C8DA', 'D9C9F5', 'BDDDF9', 'C7E9CA', 'FFFFFF', '29252D'],
        defaultVertexStyle: {fontFamily: 'Arial', fontSize: '18', fontColor: '#29252D',
            fillColor: '#D9C9F5', strokeColor: '#81738F', rounded: '1',
            absoluteArcSize: '1', arcSize: '12', whiteSpace: 'wrap', html: '1'},
        defaultEdgeStyle: {strokeColor: '#81738F', strokeWidth: '2', rounded: '1',
            edgeStyle: 'orthogonalEdgeStyle', fontFamily: 'Arial', fontSize: '14'},
        compressXml: false,
        compressStyles: false,
        enableAi: false,
        css: '@import url("jam/native.css?v=5");'
    };
}
