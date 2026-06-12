/**
 * 사이냅 에디터 기본 설정 객체 입니다.
 * key, value 형태로 설정하며, 사용하지 않는 설정 제거시 기본설정으로 동작합니다.
 * 'editor.license' 설정은 필수 설정이며, 미 설정시 에디터가 동작하지 않습니다.
 * 설정 객체 사용방법: 스크립트 추가, 에디터 초기화 config를 설정합니다.
 * ex)
        <!DOCTYPE html>
        <html lang="ko">
            <script src='synapeditor.config.js'></script>
            <script>
                window.onload = function() {
                    new SynapEditor('synapEditor', synapEditorConfig);
                }
            </script>
            <body>
                <div id="synapEditor"></div>
            </body>
        </html>

 * 참고 URL : https://synapeditor.com/docs/pages/viewpage.action?pageId=8421764
 */

var synapEditorConfig = {
    /**
     * 라이센스 파일의 경로 또는 라이센스 객체를 설정합니다.
     * ex) '/resource/license.json'
     * ex)  {
                'company': 'SynapSoft',
                'key': [
                    'licenseKey'
                ]
            }
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421764
     */
    /* 운영 서버 */
    'editor.license': {"company": "(주)효성", "key": ["U2FsdGVkX18ANENo5JBuaQ4QgK9z/ldkIWVOIE2vQNP2JM9eo48dN0+uBFP073h+hBePQ8jV0+82BTHwg+EfjBrXatNXmHrDKN8sgF4osMbgVK3T0ApFmr3ZuHZtcu1KOWThzk4rEJa7jo+TInr50lGgaVM4jM1adcBZ2VCHif3Lr2GZ/3Wow4qQJN8elQJT"]},
    /* 개발 서버 및 로컬 */
    // 'editor.license': {"company": "(주)효성", "key": ["U2FsdGVkX18V5tZyFQb7LXtn6+q/DUC24X88OGNaOosZxjC2G0VFEeG/s+60SiJrkavVr5sf7dLQ7EUgt21GmHjQmKGjhzSN/sPtKH9r1IbLiozL+vpq3Q1AP8oIGE+9hDNByEAxMhgldRsC0FzKh+rQy0k7JcjDqRVJAaM6+roJ22hnH1UQ1QwGOE0Z7Bsr"]},
    /**
     * 에디터 타입을 설정합니다.
     * ex) classic, inline, document, preview
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=3999235
     */
    'editor.type': null,

    /**
     * 에디터 첫 로딩후 안쪽으로 포커스 지정 여부를 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421920
     */
    'editor.initFocus': true,

    /**
     * 에디터의 너비를 설정합니다.
     * ex) '100%', '600px'
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421764
     */
    'editor.size.width': '100%',

    /**
     * 에디터의 높이를 설정합니다.
     * ex) '100%', '600px'
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421764
     */
    'editor.size.height': '100%',

    /**
     * 컨텐츠의 높이에 따라 에디터 높이가 변경됩니다.
     * true로 설정시 아래설정들은 무시됩니다.
     * - 'editor.size.height' (에디터 높이설정)
     * - 'editor.mode.iframe' (iframe모드)
     * @since 2.16.2304, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005572
     */
    'editor.size.height.fit': false,

    /**
     * 에디터의 최소 높이를 설정합니다.
     * px단위로만 설정이 가능합니다.
     * 'editor.size.height.fit'값을 true로 설정시 동작합니다.
     * ex) 300
     * @since 2.17.2307, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005572
     */
    'editor.size.height.fit.min': null,

    /**
     * 에디터 컨텐츠 영역 너비 고정 여부를 설정합니다.
     * 너비에 px단위의 유효한 값이 설정되었을 경우에만 적용이 됩니다.
     * @since 2.19.0, 3.1.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=72286325
     */
    'editor.contents.fixedWidth': false,

    /**
     * 에디터 편집영역(se-contents)의 크기(px)를 설정합니다.
     * 'editor.type' 값이 'document'인 경우 적용됩니다.
     * 기본값은 MS-Word A4 기준입니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22380586
     */
    'editor.document.size': {
        'width': 793,
        'height': 1122,
        'padding': { 'top': 96, 'right': 96, 'bottom': 96, 'left': 96 }
    },

    /**
     * 에디터의 높이 조절가능 여부를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421898
     */
    'editor.resizable': false,

    /**
     * 언어팩이 존재하지 않을 때 기본 에디터 표시언어를 설정합니다.
     * ex) ko, en, ja, zh
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421848
     */
    'editor.lang.default': 'en',

    /**
     * 에디터 표시언어를 직접 설정합니다.
     * null로 설정시 browser 언어로 설정되며, browser 언어 미설정시 editor.lang.default 언어로 설정됩니다.
     * ex) ko, en, ja, zh
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421848
     */
    'editor.lang': null,

    /**
     * 웹페이지가 언로드되기 전, '페이지를 나가시겠습니까' 확인 메세지 표시 여부를 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421935
     */
    'editor.unloadMessage': false,

    /**
     * 웹페이지가 언로드될 때 에디터 제거 여부를 설정합니다.
     * @since 2.19.2501, 3.1.2501
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=73760783
     */
    'editor.destroy.on.unload': true,

    /**
     * 에디터 헤더 영역을 외부 스크롤에 고정할지 여부를 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421911
     */
    'editor.mode.sticky': false,

    /**
     * 에디터의 편집영역을 iframe으로 설정하기 위한 옵션 입니다.
     *  - enable      : iframe mode 설정 여부
     *  - style.urls  : iframe 내부에 추가할 스타일 url ( 'contentsEditStyle.css': iframe mode설정시 반드시 추가되야 합니다. )
     *  - script.urls : iframe 내부에 추가할 스크립트 url ( 'SEPolyfill.min.js': iframe mode설정시 반드시 추가되야 합니다. )
     * ex)
     * 'editor.mode.iframe': {
     *      'enable': true,
     *      'style.urls': ['../dist/iframeMode/contentsEditStyle.css', ... ],
     *      'script.urls': ['../dist/iframeMode/SEPolyfill.min.js']
     * }
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/display/SE/Iframe+mode
     */
    'editor.mode.iframe': {
        'enable': false,
        'style.urls': [],
        'script.urls': []
    },

    /**
     * 에디터 가로 스크롤 사용 여부를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421903
     */
    'editor.horizontalScroll': true,

    /**
     * 에디터 툴바 버튼(드롭다운)의 크기를 설정합니다.
     * 최소값은 22 입니다. (단위 px)
     * @since 2.3.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421893
     */
    'editor.ui.button.size': null,

    /**
     * 에디터 툴바 버튼(드롭다운)의 아이콘 크기를 설정합니다.
     * 최소값은 16 입니다. (단위 px)
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421893
     */
    'editor.ui.button.icon.size': null,

    /**
     * 에디터 테마를 설정합니다.
     * ex) 'dark-gray', ....
     * @since 2.6.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=10814628
     */
    'editor.ui.theme': null,

    /**
     * 에디터 모바일 편집시 사용할 4가지 색상을 설정합니다.
     * 색상은 rgb("rgb(255, 0, 0)"), hex("#FF0000"), preset("red")형태로 설정이 가능합니다.
     * @since 2.13.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22382384
     */
    'editor.colorSet.mobile': ['#FF0000', '#FFFF00', '#008000', '#0000FF'],

    /**
     * 에디터 PC 편집시 사용할 7가지 색상을 설정합니다.
     * 색상은 rgb("rgb(255, 0, 0)"), hex("#FF0000"), preset("red")형태로 설정이 가능합니다.
     * @since 2.13.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22382384
     */
    'editor.colorSet.desktop': ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#800080'],

    /**
     * 툴바를 설정합니다.
     * ex)  'new', 'open', 'template', 'layout', 'autoSave', 'print', 'pageBreak', 'contentsProperties', 'undo', 'redo',
            'copy', 'cut', 'paste', 'copyRunStyle', 'pasteRunStyle', 'ruler', 'guide', 'source',
            'preview', 'fullScreen', 'accessibility', 'personalDataProtection', 'find', 'conversion',
            'help', 'about', 'bulletList', 'numberedList', 'multiLevelList', 'alignLeft', 'alignCenter',
            'alignRight', 'alignJustify', 'decreaseIndent', 'increaseIndent', 'paragraphProperties',
            'link', 'unlink', 'bookmark', 'image', 'background', 'video', 'file', 'table', 'div',
            'drawAbsolutePositionDiv', 'horizontalLine', 'quote', 'specialCharacter', 'emoji',
            'paragraphStyleWithText', 'fontFamilyWithText', 'fontSizeWithText', 'lineHeightWithText',
            'bold', 'italic', 'underline', 'strike', 'growFont', 'shrinkFont', 'fontColor',
            'fontBackgroundColor', 'superScript', 'subScript', 'customRunStyle', 'removeRunStyle', 'customParagraphStyle'
     * '|' : 가로 나눔 선
     * '-' : 세로 나눔 선
     * 툴바 설정 참고 : https://synapeditor.com/docs/pages/viewpage.action?pageId=8421767
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421767
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * @since 2.13.0, 3.0.0 contentsProperties
     * @since 2.17.2311, 3.0.0 customList
     * @since 2.11.0, 3.0.0 responsive
     * @since 3.3.0 codeBlock, conditionalFormatting, export, showMemo
     */
    'editor.toolbar': [
        'new', 'open', 'template', 'layout', '|',
        'contentsProperties', '|',
        'undo', 'redo', '|',
        'copy', 'cut', 'paste', '|',
        'link', 'unlink', 'bookmark', '|',
        'image', //'background', 'video', 'file', '|',
        'table', 'div', 'horizontalLine', 'quote', '|',
        'specialCharacter', 'emoji', '-',
        'paragraphStyleWithText', '|',
        'fontFamilyWithText', '|',
        'fontSizeWithText', '|',
        'bold', 'italic', 'underline', 'strike', '|',
        'growFont', 'shrinkFont', '|',
        'fontColor', 'fontBackgroundColor', '|',
        'bulletList', 'numberedList', 'multiLevelList', '|',
        'align', '|',
        'lineHeight', '|',
        'decreaseIndent', 'increaseIndent'
    ],

    /**
     * 모바일용 툴바를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * main:
     *   @since 2.18.2406 3.0.2405 horizontalLine
     */
    'editor.mobile.toolbar': {
        'main': [
            'open', 'undo', 'redo', 'copy', 'paste', 'directInsertImage', 'directInsertTable', 'simpleLink', 'unlink',
            'fullScreen', 'bulletList', 'numberedList', 'multiLevelList', 'align', 'increaseIndent', 'decreaseIndent',
            'lineHeight', 'quote', 'horizontalLine'
        ],
        'text': [
            'paragraphStyle', 'fontSize',
            'bold', 'italic', 'underline', 'strike',
            'simpleFontColor', 'simpleFontBackgroundColor'
        ],
        'table': [
            'insertRowBefore', 'insertRowAfter', 'insertColBefore', 'insertColAfter',
            'deleteRow', 'deleteCol', 'mergeCell', 'simpleFill',
            'simpleBorderColor', 'lineThickness', 'lineStyle', 'contentsAlign', 'verticalAlign', 'deleteTable'
        ],
        'div': [
            'simpleDrawingObjectFill', 'simpleDrawingObjectBorderColor', 'drawingObjectLineThickness', 'drawingObjectLineStyle', 'deleteDiv'
        ],
        'image': [
            'rotateDrawingObjectLeft', 'rotateDrawingObjectRight', 'deleteImage'
        ],
        'video': [
            'deleteVideo'
        ]
    },

    /**
     * balloon 별로 들어갈 컴포넌트들을 재정의합니다.
     * [사용방법]
     * {
     *     벌룬 이름: [ui component들의 이름, ...]
     * }
     * [사용가능한 벌룬 이름들]
     * 'text', 'image', 'video', 'drawingObject', 'tableCell', 'hyperlink'
     * [예제]
     * 'editor.balloon': {
     *     text: ["bold", "italic", "underline", "strike"]
     * }
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8422019
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * image:
     *   - @since 2.19.0, 3.1.0 groupDrawingObject, ungroupDrawingObject
     * video:
     *  - @since 2.19.0, 3.1.0 groupDrawingObject, ungroupDrawingObject
     * div:
     *   - @since 2.20.0, 3.2.0 updateTableOfContents
     * shape:
     *   - @since 2.20.2507, 3.2.2507 link, unlink, openLink
     *   - @since 2.19.0, 3.1.0 groupDrawingObject, ungroupDrawingObject
     * group:
     *   - @since 2.19.0, 3.1.0 groupProperties, deleteGroup
     */
    'editor.balloon': null,

    /**
     * 모바일용 벌룬을 설정합니다.
     * @since 2.18.2401, 3.0.2401
     * @see
     */
    'editor.mobile.balloon': null,

    /**
     * 표 풍선팝업을 tableCellSelection일 경우에만 보여줄지 여부를 설정합니다.
     * 값이 false일 경우 표 안쪽 캐럿 상태일 경우에도 표 풍선팝업이 노출됩니다.
     * @since 2.11.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22381611
     */
    'editor.table.showBalloon.onlyTableCellSelection': false,

    /**
     * 메뉴 사용 여부를 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421839
     */
    'editor.menu.show': true,

    /**
     * 사용할 메뉴 목록을 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421839
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * @since 2.10.0, 3.0.0 paragraph
     */
    'editor.menu.list': ['file', 'edit', 'view', 'insert', 'format', 'paragraph', 'table', 'tools', 'help'],

    /**
     * 각 메뉴 별 아이템을 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421839
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * @since 2.13.0, 3.0.0 file.contentsProperties
     */
    'editor.menu.definition': {
        'file': [
            'new', 'open', '-',
            'template', 'layout', 'autoSave', '-',
            'print', 'pageBreak', 'contentsProperties'
        ],
        'edit': [
            'undo', 'redo', '-',
            'copy', 'paste', 'cut', '-',
            'copyRunStyle', 'pasteRunStyle', '-',
            'find'
        ],
        'view': [
            'fullScreen', '-',
            'source', 'preview', '-',
            'ruler', 'guide'
        ],
        'insert': [
            'link', 'bookmark', '-',
            'image', 'background', 'video', 'file', '-',
            'div', 'drawAbsolutePositionDiv', 'horizontalLine', 'quote', '-',
            'specialCharacter', 'emoji'
        ],
        'format': [
            'bold', 'italic', 'underline', 'strike', '-',
            'superScript', 'subScript', '-',
            'removeRunStyle'
        ],
        'paragraph': [
            'increaseIndent', 'decreaseIndent',
            '-',
            {
                'groupName': 'list',
                'subMenuItems': ['bulletList', 'numberedList', 'multiLevelList']
            },
            {
                'groupName': 'align',
                'subMenuItems': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify']
            },
            '-',
            'paragraphProperties'
        ],
        'table': [
            'table', 'deleteTable', 'tableProperties', '-',
            {
                'groupName': 'row',
                'subMenuItems': ['insertRowBefore', 'insertRowAfter', 'deleteRow']
            },
            {
                'groupName': 'column',
                'subMenuItems': ['insertColBefore', 'insertColAfter', 'deleteCol']
            },
            {
                'groupName': 'cell',
                'subMenuItems': ['mergeCell', 'splitCell', 'cellProperties']
            },
            '-',
            {
                'groupName': 'numberFormat',
                'subMenuItems': [
                    'numberFormatText', 'numberFormatNumber1', 'numberFormatNumber2', 'numberFormatPercent1', 'numberFormatPercent2',
                    'numberFormatScientific', 'numberFormatAccounting', 'numberFormatCurrency', 'numberFormatDate', 'numberFormatTime'
                ]
            }
        ],
        'tools': [
            'webAccessibilityChecker', 'personalDataProtection', '-',
            {
                'groupName': 'conversion',
                'subMenuItems': ['upperCase', 'lowerCase', 'titleCase', 'toggleCase']
            }
        ],
        'help': [
            'help', 'shortcut', 'about'
        ]
    },

    /**
     * 에디터에서 편집시 사용가능한 폰트패밀리를 설정합니다.
     * @since 2.15.2212, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421832
     */
    'editor.fontFamily': {
        'ko': [
            '돋움', '굴림', '바탕', '궁서', '맑은 고딕',
            'Arial', 'Comic Sans MS', 'Courier New', 'Georgia',
            'Lucida Sans Unicode', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
        ],
        'en': [
            'Arial', 'Comic Sans MS', 'Courier New', 'Georgia',
            'Lucida Sans Unicode', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
        ]
    },

    /**
     * 에디터에서 편집시 사용가능한 폰트크기를 설정합니다.
     * @since 2.8.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=18579673
     */
    'editor.fontSize': [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 72, 80, 88, 96],

    /**
     * 에디터에서 편집시 사용할 폰트크기의 단위를 설정합니다.
     * 'pt'(기본값) or 'px'
     * @since 2.15.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=18579673
     */
    'editor.fontSize.unit': 'pt',

    /**
     * 에디터에서 편집시 사용가능한 줄간격을 설정합니다.
     * 줄간격은 0이상만 적용할 수 있습니다.
     * @since 2.12.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22381628
     */
    'editor.lineHeight': [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.5, 3.0],

    /**
     * 에디터에서 사용할 기본 스타일을 설정합니다.
     * 예제의 Element들의 속성만 지정이 가능하며, cssText 형태로 작성
     * ex) 'Body', Paragraph', 'TextRun', 'Div', 'Image', 'Video', 'List', 'ListItem'
           'Quote', 'Table', 'TableRow', 'TableCell', 'HorizontalLine', 'Iframe',
           'Heading1', 'Heading2', Heading3', Heading4', Heading5', Heading6'
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421928
     */
    'editor.defaultStyle': {
        'Body': 'font-family: 맑은 고딕; font-size: 11pt; line-height: 1.2;'
    },

    /**
     * 사용자 정의 문단, 글꼴 서식 스타일을 설정합니다.
     * paragraph: 문단 서식 스타일
     * textRun: 글꼴 서식 스타일
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421924
     */
    'editor.customStyle': {
        // 사용자 정의 문단 서식 스타일을 설정합니다.
        'paragraph': [{
            'name': 'Dark Gray',
            'style': {
                'color': { 'r': 98, 'g': 98, 'b': 98 } // #626262
            }
        }, {
            'name': 'Light Gray',
            'style': {
                'color': { 'r': 220, 'g': 220, 'b': 220 } // #dcdcdc
            }
        }],
        // 사용자 정의 글꼴 서식 스타일을 설정합니다.
        'textRun': [{
            'name': 'Mint 32 Bold',
            'style': {
                'fontWeight': 700,
                'fontSize': {
                    'value': 32,
                    'unit': 'pt'
                },
                'color': { 'r': 57, 'g': 182, 'b': 184 } // #39b6b8
            }
        }, {
            'name': 'Orange 24 Bold',
            'style': {
                'fontWeight': 700,
                'fontSize': {
                    'value': 24,
                    'unit': 'pt'
                },
                'color': { 'r': 243, 'g': 151, 'b': 0 } // #f39700
            }
        }]
    },

    /**
     * 임포트 시 항상 덮어쓸지(새로 넣을지) 여부를 설정합니다.
     * @since 2.4.1, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421957
     */
    'editor.import.alwaysOverwriting': false,

    /**
     * 임포트 시 항상 이어넣을지 여부를 설정합니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=81461259
     */
    'editor.import.alwaysAppending': false,

    /**
     * 임포트 시 문서의 최대 사이즈를 설정합니다.
     * 단위: B(byte)
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.import.maxSize': 10485760,

    /**
     * 임포트 API를 설정합니다.
     * ex) '/importAPI'
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.import.api': '/editor/importDoc.json',

    /**
     * 임포트 요청 헤더를 설정합니다.
     * ex) {
     *         'key': value
     *     }
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.import.headers': {},

    /**
     * 임포트 요청 시 함께 보낼 기본 파라미터를 설정합니다.
     * ex)  {
                'key': value
            }
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.import.param': null,

    /**
     * 임포트 시 에디터 편집영역 사이즈를 유지합니다.
     * @since 2.19.0, 3.1.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=63537487
     */
    'editor.import.keepContentsSize': false,

    /**
     * 임포트시 사용하는 formData field의 이름을 셋팅합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421961
     */
    'editor.import.fileFieldName': null,

    /**
     * 임포트 요청 시 사용할 request 옵션을 설정합니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.import.requestOptions': {},

    /**
     * 임포트 할 문서의 확장자를 설정합니다.
     * @since 2.8.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421963
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * @since 3.1.0 ppt, pptx
     * @since 2.11.10, 3.0.0 hwpx, odt
     */
    'editor.import.extensions': ['docx', 'doc', 'hwp', 'hwpx', 'hml', 'html', 'htm', 'txt', 'xls', 'xlsx', 'odt', 'ppt', 'pptx'],

    /**
     * 워드 계열 문서를 임포트 할 때 영역 선택 기능의 사용 여부를 설정합니다.
     * @since 2.5.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=18580469
     */
    'editor.import.selectArea.word': false,

    /**
     * 슬라이드 계열 문서를 임포트 할 때 영역 선택 기능의 사용 여부를 설정합니다.
     * @since 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=58949698
     */
    'editor.import.selectArea.slide': false,

    /**
     * 셀 임포트 할 때 기본 영역을 설정합니다.
     * 원활한 편집을 위해 행:'1 ~ 100', 열:'A ~ Z(26)' 사이를 권장합니다.
     * @since 2.14.5, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22382572
     */
    'editor.import.defaultArea.cell': { startCell: 'A1', endCell: 'Z100' },

    /**
     * 셀 임포트 할 때 자동 각 셀의 영역을 자동으로 선택할지 여부를 설정합니다.
     * @since 2.21.0, 3.3.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=85885059
     */
    'editor.import.useAutoArea.cell': false,

    /**
     * 셀 임포트 시 오른쪽 셀을 넘어서 글자를 표현할지 여부를 설정합니다.
     * 바로 오른쪽 셀에 글자가 없는 경우에만 넘어서 표현됩니다.
     * @since 2.14.5, 3.0.2402
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=63537154
     */
    'editor.import.useOverflow.cell': false,

    /**
     * 업로드 시 파일의 최대 사이즈를 설정합니다.
     * 단위: B(byte)
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.maxSize': 3145728,

    /**
     * base64 이미지의 최대 사이즈를 설정합니다.
     * 단위: B(byte)
     * ex) 'editor.image.base64.maxSize': 3145728 // 3MB
     * @since 2.18.2404, 3.0.2404
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421965
     */
    'editor.image.base64.maxSize': null,

    /**
     * 이미지 업로드 시 base64를 사용할 것인지를 설정합니다.
     * true로 설정이 이미지 업로드 후 base64로 이미지가 표현됩니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421965
     */
    'editor.upload.image.base64': false,

    /**
     * 이미지 업로드 API를 설정합니다.
     * ex) '/imageAPI'
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.image.api': '/editor/uploadFile.json',

    /**
     * 이미지 업로드 요청 헤더를 설정합니다.
     * ex) {
     *         'key': value
     *     }
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.image.headers': {},

    /**
     * 이미지 업로드 시 함께 보낼 기본 파라미터를 설정합니다.
     * ex)  {
                'key': value
            }
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.image.param': null,

    /**
     * 이미지 업로드시 사용하는 formData field의 이름을 셋팅합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421961
     */
    'editor.upload.image.fileFieldName': null,

    /**
     * 이미지 업로드 시 사용할 request 옵션을 설정합니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.image.requestOptions': {},

    /**
     * 업로드 할 이미지의 확장자를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421963
     */
    'editor.upload.image.extensions': ['jpg', 'gif', 'png', 'jpeg'],

    /**
     * 이미지 업로드전 base64형태로 미리보기를 제공합니다.
     * 암호가 걸린 이미지는 업로드 되지 않을 수 있습니다.
     * @since 2.18.2408, 3.0.2408
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=63537344
     */
    'editor.upload.image.preview': true,

    /**
     * 한글 복사/붙여넣기시 wmf이미지 업로드 API를 설정합니다.
     * ex) '/wmfToPngAPI'
     * @since 2.19.0, 3.0.2409
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.wmf.api': '',

    /**
     * wmf이미지 업로드 요청 헤더를 설정합니다.
     * ex) {
     *         'key': value
     *     }
     * @since 2.19.0, 3.0.2409
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.wmf.headers': {},

    /**
     * wmf이미지 업로드 시 함께 보낼 기본 파라미터를 설정합니다.
     * ex)  {
     *          'key': value
     *      }
     * @since 2.19.0, 3.0.2409
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.wmf.param': null,

    /**
     * wmf이미지 업로드시 사용하는 formData field의 이름을 셋팅합니다.
     * @since 2.19.0, 3.0.2409
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421961
     */
    'editor.upload.wmf.fileFieldName': null,

    /**
     * wmf이미지 업로드 시 사용할 request 옵션을 설정합니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.wmf.requestOptions': {},

    /**
     * 동영상 업로드 API를 설정합니다.
     * ex) '/videoAPI'
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.video.api': '/editor/uploadFile.json',

    /**
     * 동영상 업로드 요청 헤더를 설정합니다.
     * ex) {
     *         'key': value
     *     }
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.video.headers': {},

    /**
     * 동영상 업로드 시 함께 보낼 기본 파라미터를 설정합니다.
     * ex)  {
     *          'key': value
     *      }
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.video.param': null,

    /**
     * 동영상 업로드시 사용하는 formData field의 이름을 셋팅합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421961
     */
    'editor.upload.video.fileFieldName': null,

    /**
     * 동영상 업로드 시 사용할 request 옵션을 설정합니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.video.requestOptions': {},

    /**
     * 업로드 할 동영상의 확장자를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421963
     */
    'editor.upload.video.extensions': ['mp4', 'ogg', 'webm'],

    /**
     * iframe으로 업로드 할 도메인을 설정합니다.
     *  - pathParts: id 앞에 위치한 path
     *  - parameter: id 앞에 위치한 param
     * ex)  {
     *          'vimeo.com': {
     *              pathParts: {
     *                  '' : 'https://player.vimeo.com/video/{id}' // domain 뒤에 바로 id가 있는 경우
     *              }
     *          },
     *          'player.vimeo.com': {
     *              pathParts: {
     *                  'video': 'https://player.vimeo.com/video/{id}'
     *              }
     *          }, // 도메인이 'vimeo.com' -> 'player.vimeo.com'으로 변경되므로 반드시 변경된 도메인도 등록해야합니다.
     *          'tv.kakao.com': { // /v 혹은 /cliplink path 뒤에 id가 있는 경우
     *              pathParts: {
     *                  'v' : 'https://play-tv.kakao.com/embed/player/cliplink/{id}',
     *                  'cliplink' : 'https://play-tv.kakao.com/embed/player/cliplink/{id}'
     *              }
     *          }
     *      }
     *  'https://vimeo.com/956202369' -> 'https://player.vimeo.com/video/956202369',
     *  'https://tv.kakao.com/channel/1506/cliplink/451928372' -> 'https://play-tv.kakao.com/embed/player/cliplink/451928372'
     * @since 2.19.2501, 3.1.2501
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=73760927
     */
    'editor.upload.video.embedURLTransformers': {
        'youtube.com': {
            pathParts: {
                'shorts': 'https://www.youtube.com/embed/{id}',
                'live': 'https://www.youtube.com/embed/{id}',
            },
            parameters: {
                'v': 'https://www.youtube.com/embed/{id}'
            }
        },
        'youtu.be': {
            pathParts: {
                '': 'https://www.youtube.com/embed/{id}'
            }
        },
        'tv.naver.com': {
            pathParts: {
                'v': 'https://tv.naver.com/embed/{id}',
                'h': 'https://tv.naver.com/embed/{id}'
            }
        },
        'tv.kakao.com': {
            pathParts: {
                'livelink': 'https://play-tv.kakao.com/embed/player/livelink/{id}',
                'cliplink': 'https://play-tv.kakao.com/embed/player/cliplink/{id}',
                'v': 'https://play-tv.kakao.com/embed/player/cliplink/{id}'
            }
        },
        'play-tv.kakao.com': {
            pathParts: {
                'livelink': 'https://play-tv.kakao.com/embed/player/livelink/{id}',
                'cliplink': 'https://play-tv.kakao.com/embed/player/cliplink/{id}',
                'v': 'https://play-tv.kakao.com/embed/player/cliplink/{id}'
            },
        },
        'chzzk.naver.com': {
            pathParts: {
                'clips': 'https://chzzk.naver.com/embed/clip/{id}'
            }
        },
        'vod.sooplive.co.kr': {
            pathParts: {
                'player': 'https://vod.sooplive.co.kr/player/{id}/embed'
            }
        },
        'play.sooplive.co.kr': {
            pathParts: {
                '': 'https://play.sooplive.co.kr/{id}/embed'
            }
        },
        'vimeo.com': {
            pathParts: {
                '': 'https://player.vimeo.com/video/{id}'
            }
        },
        'player.vimeo.com': {
            pathParts: {
                'video': 'https://player.vimeo.com/video/{id}'
            }
        },
        'ted.com': {
            pathParts: {
                'talks': 'https://embed.ted.com/talks/{id}'
            }
        },
        'embed.ted.com': {
            pathParts: {
                'talks': 'https://embed.ted.com/talks/{id}'
            }
        }
    },

    /**
     * 파일 업로드 API를 설정합니다.
     * ex) '/fileAPI'
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.file.api': '',

    /**
     * 파일 업로드 요청 헤더를 설정합니다.
     * ex) {
     *         'key': value
     *     }
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.file.headers': {},

    /**
     * 파일 업로드 시 함께 보낼 기본 파라미터를 설정합니다.
     * ex)  {
     *          'key': value
     *      }
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.file.param': null,

    /**
     * 파일 업로드시 사용하는 formData field의 이름을 셋팅합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421961
     */
    'editor.upload.file.fileFieldName': null,

    /**
     * 파일 업로드 시 사용할 request 옵션을 설정합니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421955
     */
    'editor.upload.file.requestOptions': {},

    /**
     * 업로드 할 파일의 확장자를 설정합니다.
     *
     * ⚠️ 주의가 필요한 파일 형식
     * 1. 문서 계열 (doc, docx, ppt, pptx, xls, xlsx, pdf, rtf, odt, ods, odp, hwp, hwpx 등)
     *  - 매크로나 스크립트가 포함될 수 있음
     *  - 임포트시에만 허용하는 것을 권장
     *
     * 2. 마크업 / 스타일 언어 (xml, css, svg, textile, html 등)
     *  - XSS나 스크립트 삽입 위험이 있음
     *
     * 3. 실행 파일 / 임베디드 파일 (swf, eof 등)
     *  - 직접 실행될 수 있거나 안전하지 않음
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421963
     */
    'editor.upload.file.extensions': [
        'bmp', 'css', 'csv', 'diff', 'doc',
        'docx', 'eof', 'gif', 'jpeg', 'jpg',
        'json', 'mp3', 'mp4', 'm4a', 'odp',
        'ods', 'odt', 'ogg', 'otf', 'patch',
        'pdf', 'png', 'ppt', 'pptx', 'rtf',
        'svg', 'swf', 'textile', 'tif', 'tiff',
        'ttf', 'txt', 'wav', 'webm', 'woff',
        'xls', 'xlsx', 'xml', 'md', 'vtt',
        'hwp', 'hml', 'html'                               
    ],

    /**
     * 다운로드 할 이미지의 URL 패턴을 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/display/SE/downloadAndUploadImages
     */
    'editor.download.image.pattern': '',

    /**
     * 미리보기에 스타일 url을 추가합니다.
     * ex) ['dist/css/myStyle.css']
     * @since 2.10.0, 3.0.0
     * @see
     */
    'editor.preview.style.urls': [],

    /**
     * 템플릿을 설정합니다.
     * ex) [
                {
                'category': 'template_category1',
                'label': '양식',
                'items': [
                    {
                    'name': '템플릿 아이템',
                    'path': '/resource/template/template1.html'
                    }
                ]
                }
            ]
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421922
     */
    'editor.template': [],

    /**
     * 템플릿 요청 헤더를 설정합니다.
     * ex) {
     *         'key': value
     *     }
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421922
     */
    'editor.template.headers': {},

    /**
     * 테이블 템플릿 스타일을 설정합니다.
     * {
     *     templateName: {                                      // templateName에 해당하는 테이블 템플릿 스타일을 정의합니다.
     *        row: {                                            // 행들의 스타일을 정의합니다.
     *          head: {                                         // 머리행의 스타일을 정의합니다.
     *            index: 0,                                     // number: 스타일을 적용할 행을 선택합니다.
     *            style: {                                      // StyleObject: 표현할 스타일을 정의합니다.
     *              color: 'rgb(255, 255, 255)',              // string: ['red'|'rgb(255, 0, 0)'|'#FF0000'] 글자색을 지정합니다.
     *              backgroundColor: 'rgb(255, 255, 255)',    // string: [red'|'rgb(255, 0, 0)'|'#FF0000'] 배경색을 지정합니다.
     *              borders: {                                  // 테두리의 스타일을 정의합니다.
     *                top: {                                    // BorderObject: border-top 정의
     *                  type: 'solid',                          // string: ['solid'|'dashed'|'dotted'|'double'|'none'] 테두리 스타일을 지정합니다.
     *                                                                     테두리 스타일이 'double'일 경우, 테두리 두께(width)가 3 이상일 때만 이중선으로 표현됩니다.
     *                  width: 1,                               // number: 테두리 두께를 px 단위로 지정합니다. (0~10 사이의 값만 설정 가능합니다)
     *                  color: 'rgb(255, 255, 255)'           // string: [red'|'rgb(255, 0, 0)'|'#FF0000'] 테두리 색상을 지정합니다.
     *                },
     *                bottom: ...,                              // BorderObject: 설정하지 않으면 top이 적용됩니다.
     *                left: ...,                                // BorderObject: 설정하지 않으면 top이 적용됩니다.
     *                right: ...                                // BorderObject: 설정하지 않으면 left -> top 순서로 적용됩니다.
     *              }
     *            }
     *          },
     *          highlight: {                                    // 강조행의 스타일을 정의합니다.
     *              isEven: true,                               // boolean: [true|false] 짝수행에 적용할지 여부입니다. true일 경우 짝수행에 false일 경우 홀수행에 지정됩니다.
     *              style: {...}                                // StyleObject: 강조행의 스타일을 정의합니다.
     *          }
     *        },
     *        col: {...},                                       // 열들의 스타일을 정의합니다.
     *                                                             형태는 row와 같습니다.
     *        defaultStyle: {...},                              // StyleObject: 기본 셀 스타일을 정의합니다.
     *        tableStyle: {...}                                 // StyleObject: 기본 표 스타일을 정의합니다.
     *     }
     * }
     * @since 2.19.2503, 3.1.2503
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=73761029
     */
    'editor.table.template.styles': {},

    /**
     * 테이블 템플릿을 설정합니다.
     * @since 2.19.2503, 3.1.2503
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=73761029
     */
    'editor.table.template.list': {
        popup: [
            ['Basic', 'Gray Column Header', 'Gray Row Header', 'Dual Header'],
            ['Sideless Zebra', 'Sideless GrayScale', 'GrayScale', 'Striped Black Row Header']
        ],
        dialog: [
            ['Basic', 'Dashed', 'GrayScale', 'Zebra'],
            ['Sideless', 'Sideless Zebra', 'Sideless GrayScale', 'Sideless Black'],
            ['Gray Column Header', 'Dashed Gray Column Header', 'Dual Header', 'Dashed Dual Header'],
            ['Gray Row Header', 'Dashed Gray Row Header', 'Sideless Black Row Header', 'Striped Black Row Header']
        ]
    },

    /**
     * 자동 저장 여부를 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421930
     */
    'editor.autoSave': false,

    /**
     * 자동 저장 주기를 설정합니다.
     * 단위: ms
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421930
     */
    'editor.autoSave.period': 60000,

    /**
     * 자동저장 키를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see
     */
    'editor.autoSave.key': null,

    /**
     * 최근 사용한 색 목록 키를 설정합니다.
     * @since 2.16.2303, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005520
     */
    'editor.recentColorList.key': null,

    /**
     * 툴팁위치를 저장하기위한 키를 설정합니다.
     * @since 2.17.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005771
     */
    'editor.tooltip.position.key': null,

    /**
     * 단축키 툴팁을 보여줄지 여부를 설정합니다.
     * @since 2.18.2406, 3.0.2405
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=63537244
     */
    'editor.tooltip.showShortcut': true,

    /**
     * <iframe>태그 필터링을 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421933
     */
    'editor.contentFilter.allowIframe': false,

    /**
     * <embed>태그 필터링을 설정합니다.
     * @since 2.17.2308, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421933
     */
    'editor.contentFilter.allowEmbed': false,

    /**
     * <object>태그 필터링을 설정합니다.
     * @since 2.17.2308, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421933
     */
    'editor.contentFilter.allowObject': false,

    /**
     * <script>태그 필터링을 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421933
     */
    'editor.contentFilter.allowScript': false,

    /**
     * HTML태그의 event attribute 필터링을 설정합니다. ex) onclick
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421933
     */
    'editor.contentFilter.allowEventAttribute': false,

    /**
     * <link>태그 필터링을 설정합니다.
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421933
     */
    'editor.contentFilter.allowLink': false,

    /**
     * htmlBuild시 옵션을 설정합니다.
     *  - peelOffDiv : 이 값이 true이면 불필요한 Div Tag를 벗겨냅니다.
     *  - alterDuplicateId : 이 값이 true이면 중복ID에 대한 알림을 표시합니다.
     *  - checkPreWrap : 이전에 에디터를 통해 저장된 pre-wrap속성의 문단을 처리하기위한 flag입니다.
     *                   이 값이 true인 경우 se-contents 하위 p에 pre-wrap속성이 하나라도 있을 경우 검사합니다.
     *  - customTagToDiv : 이 값이 true이면 Custom Tag를 Div Tag로 변환합니다. false 이면 customTag에 se-custom-container Class를 추가해 표시합니다.
     *  - remainComment : 이 값이 true이면 html 코드에 있는 주석을 모델에 남겨둡니다.
     *  - remainNoneNode : 이 값이 true이면 display: none인 node를 남겨둡니다.
     * @since 2.10.0, 3.0.0
     *
     * ─────────────────────────────
     * 개별 속성 지원 버전
     * ─────────────────────────────
     * @since 2.5.0, 3.0.0 peelOffDiv
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=14713322
     * @since 2.7.0, 3.0.0 alertDuplicateId
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=14713322
     * @since 2.9.0, 3.0.0 customTagToDiv
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005349
     * @since 2.13.0, 3.0.0 remainComment
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22382419
     * @since 2.15.2211, 3.0.0 remainNoneNode
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005293
     *
     */
    'editor.buildOption.html': {
        'peelOffDiv': false,
        'alertDuplicateId': true,
        'checkPreWrap': false,
        'customTagToDiv': false,
        'remainComment': false,
        'remainNoneNode': false
    },

    /**
     * 편집 가이드 표시 여부를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421909
     */
    'editor.guide': false,

    /**
     * 에디터 표 핸들을 사용할지 여부를 설정합니다.
     * @since 2.3.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421913
     */
    'editor.table.handle': true,

    /**
     * 에디터 레이어의 핸들을 사용할지 여부를 설정합니다.
     * @since 2.8.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=18579683
     */
    'editor.div.handle': true,

    /**
     * 에디터 자동링크 사용 여부를 설정합니다.
     * @since 2.5.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421944
     */
    'editor.autoLink': true,

    /**
     * 에디터 자동링크에 target 값을 설정합니다.
     * @since 2.18.2406, 3.0.2403
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=8421944
     */
    'editor.autoLink.defaultTarget': '_blank',

    /**
     * 특정 텍스트 입력 후 실행할 자동 액션을 설정합니다.
     * - name : 실행할 이벤트 이름
     * - trigger : 자동 액션을 실행할 텍스트
     * - removeTriggerText : 기존 텍스트를 제거할지 여부 (true: 제거, false: 제거하지 않음)
     * - skipElements : 자동 액션을 실행하지 않을 부모 Element 목록
     * - enable : 자동 액션을 실행할지 여부 (true: 실행, false: 실행하지 않음)
     * ex) {
     *      '*': {
     *          name: 'setCircleList',
     *          trigger: ' ',
     *          removeTriggerText: true,
     *          skipElements: ['ListItem'],
     *          enable: true
     *      },
     *      '@': {
     *          name: 'mention',
     *          trigger: '', // 단일 문자를 트리거로 사용할 경우 빈 문자열로 설정
     *          removeTriggerText: true,
     *          skipElements: [],
     *          enable: true
     *      },
     * @since 2.20.2509, 3.2.2509
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=81461406
     */
    'editor.autoAction': {
        '*': {
            name: 'setCircleList',
            trigger: ' ',
            removeTriggerText: true,
            skipElements: ['ListItem'],
            enable: true
        },
        '-': {
            name: 'setSquareList',
            trigger: ' ',
            removeTriggerText: true,
            skipElements: ['ListItem'],
            enable: true
        },
        '#': {
            name: 'setBasicNumberedList',
            trigger: ' ',
            removeTriggerText: true,
            skipElements: ['ListItem'],
            enable: true
        },
        '1.': {
            name: 'setBasicNumberedList',
            trigger: ' ',
            removeTriggerText: true,
            skipElements: ['ListItem'],
            enable: true
        }
    },

    /**
     * @deprecated 2.20.2509, 3.2.2509부터 더 이상 사용되지 않습니다.
     * '*, -, #, 1. + space'를 사용하여 글머리 기호/번호를 삽입하는 기능의 사용 여부를 설정하는 옵션이며,
     * `editor.autoAction` 옵션으로 대체되었습니다.
     *
     * `editor.autoAction` 옵션을 통해 다양한 자동 액션을 정의할 수 있으며,
     * 기존 `editor.autoList` 기능('*', '-', '#', '1.' + space)도 동일하게 설정 가능합니다.
     *
     * ⚠️ 단, 호환성 유지를 위해 `editor.autoList`를 false로 설정하면 `editor.autoAction`도 비활성화되므로,
     * 신규 환경에서는 `editor.autoAction`만 단독으로 활용해주세요.
     * @since 2.7.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=14713223
     */
    'editor.autoList': true,

    /**
     * 일반 글머리(HTML List) 사용 여부를 설정합니다.
     * @since 2.11.10, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=17334285
     */
    'editor.useHTMLList': false,

    /**
     * 글머리번호의 타입을 설정합니다.
     * @since 2.12.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22381646
     */
    'editor.list.numberedListItems': ['decimal', 'decimalEnclosedCircle', 'decimalParentheses', 'upperLetter', 'lowerLetter', 'upperRoman', 'lowerRoman', 'ganada', 'chosung'],

    /**
     * 커스텀 글머리를 설정합니다.
     * 9레벨 까지 설정이 가능합니다.
     * 9레벨 이후로 설정된 글머리는 표현되지 않습니다.
     * ex) [
                { format: 'decimal' },
                { format: 'bullet', levelText: '□' },
                { format: 'bullet', levelText: '♧' },
                { format: 'decimalEnclosedCircle' },
                ...
            ]
     * @since 2.17.2311, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=81461411
     */
    'editor.list.customList': [],

    /**
     * 다단계글머리의 타입을 설정합니다.
     * multi_1 : 1.
     *               1.1
     *                   1.1.1
     * multi_2 : 1.
     *           1.1
     *           1.1.1
     * multi_3 : 1
     *           1-1
     *           1-1-1
     * multi_4 : (1)
     *               (1.1)
     *                   (1.1.1)
     * multi_5 : (1)
     *           (1.1)
     *           (1.1.1)
     * @since 2.12.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22381648
     */
    'editor.list.multiLevelListItems': ['none', 'multi_1', 'multi_2', 'multi_3', 'multi_4', 'multi_5'],

    /**
     * 도움말 기능 실행시 연결할 URL을 설정합니다.
     * ex) 'https://synapeditor.com/docs'
     * @since 2.10.0, 3.0.0
     * @see https://synapeditor.com/docs/display/SEDOC/Help+URL
     */
    'editor.help.url': '',

    /*
     * 객체 회전시 shift키로 조절할 각도값을 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see
     */
    'editor.edit.rotate.step': 15,

    /**
     * 알림창이 자동으로 사라지기(fadeout) 전 표시되는 시간을 밀리초(ms) 단위로 설정합니다.
     * @since 2.1.0, 3.0.0
     * @see
     */
    'editor.notification.fadeout': 3000,

    /**
     * 라이선스 만료 알림 메시지가 나타나는 일수(day)를 설정합니다.
     * @since 2.10.0, 3.0.0
     * @see
     */
    'editor.notification.license.showDays': 20,

    /**
     * 알림창이 노출되는 레벨을 설정합니다. (error, warning, info 세 가지 레벨 중 선택)
     * @since 2.10.0, 3.0.0
     * @see
     */
    'editor.notification.show.level': ['error', 'warning', 'info'],

    /**
     * 반응형 보기 버튼의 아이템을 설정합니다.
     * - iconName: 아이콘의 이름을 설정합니다. ('desktop', 'mobile', 'tablet', ..)
     * - message: 메세지를 설정합니다. 설정한 값이 메세지 키로 등록되어 있으면 등록된 메세지를 보여줍니다.
     * - size: 크기를 설정합니다. ({ width: {Number}, height: {Number} })
     * @since 2.11.0, 3.0.0
     * @see
     */
    'editor.responsive.items': [
        { 'iconName': 'mobile', 'message': 'message.label.mobile', 'size': { 'width': 412, 'height': 846 } },
        { 'iconName': 'tablet', 'message': 'message.label.tablet', 'size': { 'width': 768, 'height': 1024 } }
    ],

    /**
     * 반응형 편집을 사용할지 여부입니다. (기본값 false)
     * true로 설정하게 되면 이미지/비디오 속성에서 반응형 여부를 체크할 수 있게됩니다.
     * @since 2.11.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22381543
     */
    'editor.responsive.use': false,

    /**
     * 이미지, 동영상 삽입 시 반응형 편집을 기본으로 사용할지 여부입니다. (기본값 false)
     * true로 설정하게 되면 이미지/비디오 속성에서 반응형 여부가 기본으로 체크되어 있습니다.
     * @since 2.13.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22382425
     */
    'editor.responsive.default.use': false,

    /**
     * 표 삽입시 px형태로 삽입할지를 설정합니다.
     * 값이 false일 경우 표의 너비가 "%"로 삽입됩니다.
     * @since 2.11.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=22381633
     */
    'editor.table.defaultWidthUnit.px': false,

    /**
     * 이벤트 등록을 일정시간 지연시킵니다.
     * @since 2.11.10, 3.0.0
     * @see
     */
    'editor.attachEvent.time': 0,

    /**
     * Alt + , 단축키를 실행해 에디터에서 포커스가 제거되었을 때,
     * 에디터 위쪽으로 포커스할 대상 Element가 있다면 Selector를 설정합니다.
     * @since 2.15.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=58949731
     */
    'editor.removeFocus.prev.selector': '',

    /**
     * Alt + . 단축키를 실행해 에디터에서 포커스가 제거되었을 때,
     * 에디터 아래쪽으로 포커스할 대상 Element가 있다면 Selector를 설정합니다.
     * @since 2.15.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=58949731
     */
    'editor.removeFocus.next.selector': '',

    /**
     * 접근성 - 편집과 관련된 보조 메세지 사용을 설정합니다.
     * @since 2.16.2303, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005566
     */
    'editor.accessibility.assistiveMessage': false,

    /**
     * 바로 삽입 기능을 사용할지 여부를 설정합니다.
     * @since 2.17.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005621
     */
    'editor.quickInsert.show': true,

    /**
     * 바로 삽입에 보여질 컴포넌트를 설정합니다.
     * @since 2.17.0, 3.0.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=48005621
     */
    'editor.quickInsert': ['directInsertImage', 'directInsertVideo', 'directInsertTable', 'directBulletList', 'directNumberedList'],

    /**
     * td에 width를 적용할지 여부를 설정합니다.
     * @since 2.18.2406, 3.0.2404
     * @see
     */
    'editor.table.applyCellWidth': false,

    /**
     * 외부 컨테이너가 위치할 Element를 찾는 Selector를 설정합니다.
     * @since 2.19.2501, 3.1.2501
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=73760836
     */
    'editor.external.container.selector': '',

    /**
     * 외부 컨테이너에 Shadow DOM을 설정하기 위한 옵션 입니다.
     * true로 설정하면 외부 컨테이너가 Shadow DOM에 포함됩니다.
     * 외부 CSS 영향을 받지 않기 위해 사용합니다.
     *  - enable      : shadowDOM mode 설정 여부
     *  - style.urls  : shadowDOM 내부에 추가할 스타일 url
     * ex)
     * 'editor.external.container.enableShadowDOM': {
     *      'enable': true,
     *      'style.urls': ['../dist/synapeditor.min.css', ... ]
     * }
     * @since 3.2.2509
     * @see
     */
    'editor.external.container.enableShadowDOM': {
        'enable': false,
        'style.urls': []
    },

    /**
     * 제목(H1~H6)의 클래스와 스타일을 설정합니다.
     * ex) {
                H1: { style: 'font-size: 24pt; font-weight: bold; color: red;', className: 'h1' },
                H2: { style: 'font-size: 20pt; font-weight: bold; color: orange;', className: 'h2' },
                H3: { style: 'font-size: 18pt; font-weight: bold; color: yellow;', className: 'h3' },
                H4: { style: 'font-size: 16pt; font-weight: bold; color: green;', className: 'h4' },
                H5: { style: 'font-size: 14pt; font-weight: bold; color: blue;', className: 'h5' },
                H6: { style: 'font-size: 11pt; font-weight: bold; color: purple;', className: 'h6' }
            }
     * @since 2.20.0, 3.2.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=78839856
     */
    'editor.titleStyle': {},

    /**
     * 팝업이 에디터 영역을 넘지 않도록 설정합니다. (기본값 false)
     * @since 2.20.0, 3.2.0
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=78839843
     */
    'editor.popup.preventOverflow': false,

    /**
     * 잠긴 요소(se-lock) 안쪽에 UI를 표시하지 않도록 설정합니다. (기본값 false)
     * true일 경우, 잠긴 요소 안쪽에는 quickInsert, balloon을 표시하지 않습니다.
     * @since 2.20.2507, 3.2.2507
     * @see https://synapeditor.com/docs/pages/viewpage.action?pageId=81461271
     */
    'editor.ui.disableUIOnLockedElement': false
};