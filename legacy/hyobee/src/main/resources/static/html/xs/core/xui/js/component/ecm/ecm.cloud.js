//------------------------------------------------
//파일 가져오기 팝업 호출 - client to Hi-Cloud
//------------------------------------------------
function popupCloudAttach(loginId, returnTarget) {

		// 허용확장자
		//var allowFileExt = "png,xlsx,exe"
		// 허용 파일 사이즈 MB
		var limitFileSize = "10";
		// 문서
		var takeOut = "Y"
		// 주소창 URL 감추기 위한 frameset 페이지 (무조건 고정)
		//var urlHiddenTarget = "http://150.186.12.178:9080/common/externaldownloadfiles.jsp";
		// ECM 서버 URL
		//var url = "http://150.186.12.135:8080/external/externalDownloadFiles";
		//var url = "http://localhost:8080/common/CommonController/cloudAttachPopup2.dev";
		//var url = "http://" + request.getServerName() + ":" + request.getServerPort() + "/common/CommonController/cloudAttachPopup.dev";
		//var url = "http://10.11.251.84/external/externalDownloadFiles";

		var width = 1020;
		var height = 620;
		var left = (screen.availWidth - width) / 2;
		var top = (screen.availHeight - height) / 2;

//		window.name = "parentForm";
	    var parentWindow = window.parent;
		var hc_downdoc = parentWindow.open(
						'',
						'hc_downdoc',
						"toolbar=no, width="
								+ width
								+ ", height="
								+ height
								+ ", directories=no, status=no, scrollorbars=yes, resizable=no, location=no, left="
								+ left + ", top=" + top);

		if (hc_downdoc != null) {
			hc_downdoc.focus();
		}
		var form = document.createElement("form");

		form.setAttribute("method", "POST");
		form.setAttribute("action", returnTarget);
		form.setAttribute('target', "hc_downdoc");

		var hiddenField1 = document.createElement("input");
		hiddenField1.setAttribute("type", "hidden");
		hiddenField1.setAttribute("name", "loginId");
		hiddenField1.setAttribute("value", loginId);

		var hiddenField2 = document.createElement("input");
		hiddenField2.setAttribute("type", "hidden");
		hiddenField2.setAttribute("name", "returnTarget");
		hiddenField2.setAttribute("value", returnTarget);

		var hiddenField3 = document.createElement("input");
		hiddenField3.setAttribute("type", "hidden");
		hiddenField3.setAttribute("name", "takeOut");
		hiddenField3.setAttribute("value", takeOut);

		form.appendChild(hiddenField1);
		form.appendChild(hiddenField2);
		form.appendChild(hiddenField3);
		document.body.appendChild(form);

		form.submit();
		document.body.removeChild(form);

}

//------------------------------------------------
//첨부할 클라우드 파일목록
//------------------------------------------------
function fncGetFileObj(fileObj) {
	$("#attachedFiles").empty();
	$.each(fileObj, function(index, el){
		var fileSizeK = Math.round(el.fileSize / (1024));

		var tblRow = "<tr class='Lfirst'><td width='20' valign=middle><input type='checkbox' id='chk_ecm' name='chk_ecm' class='Lcheckbox' fileSize='" + fileSizeK + "'' onchange='fncCalcTotSize();'></td>";
		tblRow += "<td width=90%><a href='" + el.downLoadUrl + "'>"
							+ el.fileName.replace("%20"," ");
							+ "("
							+ fileSizeK
							+ " KB"
							+ ")" + "</a></td>";
		tblRow += "<td width='10%'><input type='hidden' id='attachment_client_name' name='attachment_client_name' value='" +  el.fileName + "' />";
		tblRow += "<textarea id='downLoadUrl' name='downLoadUrl' style='display: none' >"
				+ el.downLoadUrl + "</textarea>";
		tblRow += "<input type=hidden id='chk_ecm_YN' name='chk_ecm_YN' value='N' />";
		tblRow += "<input type=hidden id='fileSize' name='fileSize' value='" + el.fileSize + "' />";
		tblRow += "</td></tr>";
		$("#attachedFiles").append(tblRow);
						});

		fncCalcTotSize();
}

function fncCalcTotSize(){
	var totSizeK = 0;
	var chk_ecm = $("#attachedFiles #chk_ecm");
	$.each(chk_ecm, function(index, el) {
		if (this.checked == true) {
			totSizeK += Math.round($(this).attr('fileSize')*1000)/1000.0;
		}
	});
	//$("#totDiv #totFileSize").html("총 " + (totSizeK).toFixed(3) + " MB 선택");
	$("#totDiv #totFileSize").html("Total " + (totSizeK).toFixed(3) + " MB");
}
//------------------------------------------------
// 첨부파일 저장 버튼 유효성 검사
//------------------------------------------------
function fncValidateCloudAttach(objChk) {
	var totSizeK = 0;
	var cntChk = 0;
	$.each(objChk, function(index, el) {
		if (this.checked == true) {
			totSizeK += Math.round($(this).attr('fileSize')*1000)/1000.0;
			$("#attachedFiles #chk_ecm_YN").eq(index).val("Y");
			$(this).val("Y");
//			alert($("#attachedFiles #attachment_client_name").eq(index).val());
			cntChk++;
		} else {
			$("#attachedFiles #chk_ecm_YN").eq(index).val("N");
		}
	});
//	return false;

	$("#totDiv #totFileSize").html("Total " + (totSizeK).toFixed(3) + " MB");

	var isLimitSize = false;
	$.each(objChk, function(index, el) {
		if (this.checked == true) {
			if ($(this).attr('fileSize') > 100) {
				isLimitSize = true;
				return;
			}
		}
	});
	if (isLimitSize) {
		alert("첨부파일 개별 용량 제한은 100MB입니다.");
		return false;
	}

	var isLimitTotSize = false;
	if (totSizeK > 500) {
		isLimitTotSize = true;
	}
	if (isLimitTotSize) {
		alert("첨부파일 합산 용량 제한은 500MB입니다.");
		return false;
	}
	return true;
}

function fileNameReplace(file_name, file_name_length) {
    var fileName =  file_name;
    fileName = fileName.replace("&nbsp;","_");
	fileName = fileName.replace("nbsp;","_");
	fileName = fileName.replace("%20","_");
    fileName = fileName.replace(/\s/g, "_");
    fileName = fileName.replace("\"", "");
    fileName = fileName.replace("\`", "");
    fileName = fileName.replace("\'", "");
    fileName = fileName.replace("\&", "");
    fileName = fileName.replace(/\"/gi, "");
    fileName = replaceAll(fileName,'&#39;','');

    var strArray = fileName.split(".");
    var len = strArray.length;

    if(len > 1) {
        var ext = strArray[len-1];
        fileName = "";
        for(var i=0; i<len-1; i++) {
            fileName += strArray[i];
        }
        if(file_name.length > file_name_length){
            fileName = fileName.substring(0,file_name_length-2-ext.length);
        }

        var regExp = /[\'\"]/gi;
        fileName = fileName.replace(regExp, "");

    	console.log('fileName : '+fileName);
        fileName = fileName + "."+ ext
    }
    return fileName;
}

function replaceAll(str, searchStr, replaceStr) {
	  return str.split(searchStr).join(replaceStr);
}