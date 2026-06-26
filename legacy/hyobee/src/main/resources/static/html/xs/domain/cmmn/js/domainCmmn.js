"use strict";

// 마우스오른쪽 컨텍스트메뉴 표시 여부는 도메인에서 결정한다.
document.oncontextmenu = (function(e){
	// Close active directive
	xuic.__COM.closeActiveDirective();
	// Available when application service mode is not real mode (LOCAL,DEV,REAL)
    return (top.xuic.__CONFIG.appServiceMode !== "REAL");
});

// 개인정보화면 대상일 경우 복사기능을 제어할지 여부 판단은 도메인에서 결정한다. ctrl + c or 복사 금지
window.addEventListener("copy", (e) => {
    // 개발 편의를 위해 임시 해제
    return;
	if (gIsPrivacyPage) {
		xui.dialog.warning(xui.enum.SECURITY_NO_COPY.getName());
		e.preventDefault();
		// 클립보드에 저장된 컨텐츠 삭제
		e.clipboardData.clearData("Text"); 
		return false;
	}
});


class _domainCmmn {
    constructor() {
        this.enum = new Enumeration();
        this.enum.setEnum("NONE"			, ""			, ""			, "");

        var menuInfoList = xui.extends.session.getSessionInfoByKey("MENU_INFO");
        if (!xui.valid.isEmpty(menuInfoList)) {
            var arrMenuInfo 				= menuInfoList.split(",");
            var url = new URL(location.href);
            var urlParams 					= url.searchParams;
            var menuKey 					= urlParams.get('menuKey');
            for (var i in arrMenuInfo) {
                var menuData = arrMenuInfo[i];
                var menuIdx 				= menuData.indexOf(menuKey);
                if (menuIdx >= 0) {
                    var arrMenuInfo = menuData.split("||");
                    if (parseInt(arrMenuInfo[1]) > 0) { gIsPrivacyPage 	= true;} 						// 개인정보권한 판단
                    if (parseInt(arrMenuInfo[2]) > 0) { gBlnMenuServiceInfo = true;} 					// 서비스코드 (구독형일 경우 이용)
                    if (!xui.valid.isEmpty(arrMenuInfo[3])) { gStrMenuServiceName = arrMenuInfo[3];} 	// 서비스이름 (구독형일 경우 이용)
                    break;
                }
            }
        }
    }
};

var domainCmmn	= new _domainCmmn();
_domainCmmn	= null;

