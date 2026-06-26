/***************************************************************************************************************************************************************
* @classDescription 사용자별 데이터 권한관리
* @author HyosungITX Corp.
* @version 1.0
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2019/02/21        xtrmAI팀             신규생성
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
****************************************************************************************************************************************************************/
"use strict";
/***************************************************************************************************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ***************************************************************************************************************************************************************/
var IMPORT		 = "TREE,GRID";
var mobjTxValue	 = null;
var corpList     = [];
var changeData   = {};
var mobjTimeout			    = null;
var mobjUnAuthUserData	    = {};
var mobjAuthUserData	    = {};
var mobjSaveAuthUserData	= [];
/***************************************************************************************************************************************************************
 * Document Ready : jquery에서 제공하는 함수를 이용하여 화면이 로드될 때 처리할 함수를 정의한다.
 ***************************************************************************************************************************************************************/
function PageReady(){
	menu340.completePageRender();
}
/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription :
 */
var menu340={
/***************************************************************************************************************************************************************
 * completePageRender Function : 화면이 초기 로드 시점에 처리할 사항을 정의한다.
 ***************************************************************************************************************************************************************/
	completePageRender : function(){
		//페이지 상수 정의
		menu340.setPageEnum();
		//탭 화면 디자인
		menu340.defineTab();
		//툴바 화면 디자인
		menu340.defineToolbar();
		//그리드 디자인
		menu340.defineGrid();
		//트리뷰 디자인
		menu340.defineTree();
		//다이얼로그 레이어 화면 디자인
		menu340.defineDialog();
		//파일 화면 디자인
		menu340.defineFile();
		//초기데이터설정
		menu340.initPage();
		//이벤트 정의
		menu340.defineEvent();
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ENUM: 열거형 class 상수 정의 [기본함수명:setPageEnum]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	setPageEnum : function(){
		menu340.enum		= new Enumeration();
        menu340.enum.setEnum("CHANGE_DATA_CONFIRM_SAVE",""	,"CHANGE_DATA_CONFIRM_SAVE"   ,"");
        menu340.enum.setEnum("NOT_SAVE_DELETE_DATA"    ,""	,"NOT_SAVE_DELETE_DATA"       ,"");
    },
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TAB: 탭버튼 구성을 위한 함수 정의 [기본함수명:defineTab + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineTab : function(){
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TOOLBAR: 툴바 구성을 위한 함수 정의 [기본함수명:defineToolbar + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineToolbar : function(){
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GRID: 그리드 구성을 위한 함수 정의 [기본함수명:defineGrid + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineGrid : function(){
		$("#divGrid00").XuiGrid({
			ratio				: true,
			headerAlign			: "center",
			header				: true,
			headerHeight		: 44,
			rowHeight			: 34,
			enableAutoHeight	: true,
		    editDiv				: "",
			freezeColumn		: "",
			colNames			: [
                 //"PU","법인", "Team", "사용자명", "ID", "PU권한", "회사권한"
                   xui.message.get("puCode")
                 , xui.message.get("corp")
                 , xui.message.get("userName")
                 , xui.message.get("id")
                 , xui.message.get("team")
                 , "사업 " + xui.message.get("auth")
                 , "팀 " + xui.message.get("auth")
                 , ""
			],
			colModel			: [
			    {name:"puName"					,width:15		,align:"left"		,hidden:true	,sort:false	,excel:true		,html:false		,format:""									},
			    {name:"sapCorpName"				,width:19		,align:"left"		,hidden:true	,sort:false	,excel:true		,html:false		,format:""									},
			    {name:"userName"    			,width:19		,align:"center"		,hidden:false	,sort:true	,excel:true		,html:false		,format:""									},
			    {name:"userId"    				,width:23		,align:"center"		,hidden:false	,sort:true	,excel:true		,html:false		,format:""									},
			    {name:"deptName"				,width:25		,align:"left"		,hidden:false	,sort:false	,excel:true		,html:true		,format:""	,convertFn:menu340.convertData	},
			    {name:"puCodeCount"  			,width:15		,align:"right"		,hidden:false	,sort:false	,excel:true		,html:false		,format:"xuiform_number"					},
			    {name:"sapCorpCodeCount"    	,width:15		,align:"right"		,hidden:false	,sort:false	,excel:true		,html:false		,format:"xuiform_number"					},
			    {name:"fullDeptName"			,width:0		,align:"right"		,hidden:true	,sort:true	,excel:true		,html:false		,format:""	               					}
			],
			onClickData:function(rowIdx, rowId, rowData, cellIdx, cellId, cellData){
			    // 변경 사항이 존재할 경우
			    if(Object.keys(changeData).length!==0){
                    setTimeout(() => {
                        //menu340.saveData("변경사항이 존재합니다. 저장 하시겠습니까?", "저장하지 않을 경우 변경한 데이터가 사라집니다.",true)
                        menu340.saveData(menu340.enum.CHANGE_DATA_CONFIRM_SAVE.getName(), menu340.enum.NOT_SAVE_DELETE_DATA.getName(),true);
                    }, 10);
			        return;
			    }

			    if(! xui.valid.isEmpty(rowData.userId) ){
//                    menu340.selectDataPuList(rowData);
//                    menu340.selectDataBusinessList(rowData);
                    menu340.selectAuthDataUser(rowData.userId);
                }
			},
			onDblClickData:function(rowIdx, rowId, rowData, cellIdx, cellId, cellData){
			},
			alwaysCallClick		: false,							//(옵션){boolean} 행 클릭 시 콜백함수(onClickData) 무조건 호출 여부 (Default : false)
			rownumbers			: false, 						//줄번호 보이기
			multiselect			: false,						//(옵션){boolean} 다중 선택 가능 여부(체크박스) (Default : false)
			multiAllDisabled	: false,						//(옵션){boolean} 헤더 전체 선택 체크박스 비활성화 여부 (Default : false)
			multiRowSelect		: false,						//(옵션){boolean} 다중 행 선택 가능 여부(ctrl or shift key & mouse click) (Default : false)
			statusBar			: true,							//(옵션){boolean} 그리드 하단 상태바 표출 여부 (Default : false)
			statusMsg			: xui.enum.GRID_SELECTED_DATA.getName(),				//(옵션){String} 그리드 하단 상태바 표출 메시지 (Default : '건의 데이터가 검색되었습니다.')
			emptyrecords		: xui.enum.GRID_NO_DATA.getName(),		//(옵션){String} 그리드 데이터 조회 결과가 0건일 시 표출 메시지 (Default : '데이터가 존재하지 않습니다.')
			colMove				: false,						//(옵션){boolean} 컬럼 drag & drop 이동 가능 여부 (Default : false)
			enableExportExcl	: false,
			exportFromClient	: false,
			smartRender			: false,							//(옵션){boolean} 스마트 렌더링 처리 여부(대용량 데이터 컨트롤 시 필수옵션) (Default : false)
			scrollAppend		: false,						//(옵션){boolean} 스크롤 데이터 추가 방식 처리 여부 (Default : false)
			rowDragMove			: false,
			enableAddRow		: false,
			enableRemoveRow 	: false,
			paging				: true,						//(옵션){boolean} 페이징 처리 여부 (Default : false)
			pageViewSize		: 5,
			rowList				: [15, 30, 45, 100]						//(옵션){Object Array} 1개 페이지 당 표출되는 데이터 건수 콤보 데이터 (Default : [50, 100, 150, 200, 250, 300])
		});

	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TREE: 트리뷰 구성을 위한 함수 정의 [기본함수명:defineTree + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineTree : function(){
	    $("#divTree01").XuiTree({
            rootNodeId				: "*",
            spread					: false,				//(옵션){boolean} 초기로드시 전부 펼쳐진 상태로 로드할 지 여부 (default:false)
            headerTitle				: xui.enum.SYNTAX_ERROR.getName(),				//(옵션){string} 헤더 타이틀 (default:"")
            spreadLevel				: 3,				//(옵션){int} 초기로드시 펼쳐진 상태로 로드할 기준 노드레벨 (default:0)
            searchTitle				: true,				//(옵션){boolean} 이름검색 기능 활성화여부 (default:false)
            tooltip					: false,			//(옵션){boolean} 툴팁 노드 타이틀로 보여주기 여부 (default:true)
            leafNodeIcon			: "ico_division.svg",
            openNodeIcon			: "ico_division.svg",
            closeNodeIcon			: "ico_division.svg",
            multiselect				: true,
            multiNodeSelect			: false,
            edit					: true,
            enableAddNode			: true,
            enableAddChildNode		: true,
            enableCutNode			: false,
            enablePasteNode			: false,
            enableRemoveNode		: true,
            nodeDragMove			: true,
            removeAfterDrag			: false,
            dragBehavior			: "complex",
            alwaysCallClick			: false,
            dataKey					: {nodeId:"deptCode", parentNodeId:"upperDeptCode", nodeTitle:"deptName"},
            nodeAddKey				: {upperDeptCode:"upperDeptCode",selfDeptCode:"selfDeptCode"},
            onClickData				: function(id, parentId, prevId, data){
            },
            unselectDataDept			: function(id, data){
            },
            onChangedEdit		: function(id, parentId, data, parentData){
            },
            onBeforeAdd         : function(nodeId, parentNodeId, data){
            },
            onBeforeRemove          : function(ids, data){
            },
            onRemoved				: function(ids, data){
            },
            onBeforeDragNode		: function(nodeIds, moveData){
                return false;
            },
            onBeforeDropNode		: function(sourceNodeId, targetNodeId, sourceNodeData, targetNodeData, insertNextNodeId, sourceTreeId, targetTreeId){
                return false;
            },
            onDropNode				: function(sourceNodeId, targetNodeId, sourceNodeData, targetNodeData, insertNextNodeId, sourceTreeId, targetTreeId){
            }
        });

	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DIALOG WINDOW: 레이어 팝업 창 구성을 위한 함수 정의  [기본함수명:defineDialog + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineDialog : function(){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// FILE VIEWER : 레이어 팝업 창 구성을 위한 함수 정의 [기본함수명:defineFile + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineFile : function(){
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// INIT PAGE: 초기데이터 로드를 위한 함수 정의 [기본함수명:initPage + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	initPage : function(){
	    // MANAGEMENT PU,PG,CORP COMBO LIST LOAD
//        menu340.loadManagementCombo();
		// 페이지 로드할 때 사용자 리스트를 조회한다.
		menu340.selectData();
		// 조직도 전체 조회
		menu340.selectAuthDataUser();
		//메뉴정보 form 비활성화
//		xui.util.disableAll("deptDetailForm", true, true, false);
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEFINE EVENT: 화면에 디자인 된 버튼 및 오브젝트 이벤트와 호출할 함수 정의
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	defineEvent : function(){
	    $("#btnSearch").click(function(e){menu340.selectData();});
	    $("#userName",searchForm).keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){menu340.selectData();return false;}});
		// Team 팝업 검색 (공통)(Grid)(수정)
		$("#deptInfo",searchForm).keypress(function(e){if(e.which === xui.enum.ENTER_EVENT.getCode()){$("#deptInfo",searchForm).blur();return false;}});
		$("#deptInfo",searchForm).click(function(e){if(this.fromIcon){$("#deptInfo",searchForm).blur();return false;}});
		$("#deptInfo",searchForm).blur(function(e){
			if(!xui.valid.isEmpty($("#deptInfo",searchForm).valExt())||e.target.fromIcon){
				menu340.getManagementTeamGrid(searchForm, e.target.fromIcon);
			} else {
				$("#deptCode",searchForm).valExt("");
				$("#deptName",searchForm).valExt("");
			}
		});

		$("#btnRefreshUnAuth").click(function(e){menu340.selectAuthDataUser();});
//        $("#btnRefreshAuth").click(function(e){menu340.selectAuthDataUser("AUTHDATA");});

        $("#btnSave").click(function(e){menu340.saveData();});

        // 법인회사 변경시
        $("#corpCode",searchForm).change(function(e){menu340.changeCorpCode();});
	},
/***************************************************************************************************************************************************************
 * Main Functions: 화면상에 주요 기능을 처리하는 함수를 정의한다.
 ***************************************************************************************************************************************************************/
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// NEW FORM: 신규 데이터 처리에 대한 함수 정의 [기본함수명:newForm + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	newForm : function(){
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SELECT: 조회 데이터 처리에 대한 함수 정의 [기본함수명:selectData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	selectData : function(userId){

        // 변경 사항이 존재할 경우
        if(Object.keys(changeData).length!==0){
            menu340.saveData("변경사항이 존재합니다. 저장 하시겠습니까?", "저장하지 않을 경우 변경한 데이터가 사라집니다.",true);
//            menu340.saveData(menu340.enum.CHANGE_DATA_CONFIRM_SAVE.getName(), menu340.enum.NOT_SAVE_DELETE_DATA.getName(),true);
            return;
        }

		//조회 전 초기화
//		$("#divGrid00").api().init();
//		mobjAuthUserData	    = {};
        menu340.initSelectDepthData();

		//데이터유효성 체크
		if(!menu340.validationSelectData()){return;}
		//서버에 전송할 파라미터 객체 생성
		var param = new xui.json();
		param.setURL("/xs/vob/management/selectMenu340.json");								//request mapping Controller method URL
		param.setDataJsonObject(xui.util.getFormData("searchForm"));						//조회조건 파라미터셋
		param.setGridId("divGrid00");														//결과데이터 바인딩 그리드ID
		param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());								//요청기능 권한코드(필수)
		param.setCallBack(function(response, request){
			if(!response.getErrorFlag()){
				$("#divGrid00").api().loadData(response);
				if(response.getCount() > 0){
				    if(xui.valid.isEmpty(userId)){
				        $("#divGrid00").api().select(0);
				    }else{
                        var gridData  = $("#divGrid00").api().getAllData();
						var selectRow = gridData.filter( (row) => row.userId === userId );
						if(selectRow.length===1){
							$("#divGrid00").api().select(selectRow[0].ROW_ID);
						}else{
							$("#divGrid00").api().select(0);
						}
				    }
				}
			}else{
				xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
			}
		});
		xui.ajax.callService(param);
	},

	validationSelectData : function(){
		//프레임웍에서 지원하는 기본 유효성 체크
		if(!xui.valid.check("searchForm")){return false;}
		//기타 개발자 정의 유효성 체크
		return true;
	},


    //20250624 추가 kimsso
    selectAuthDataUser:function(userId){
        //데이터 초기화
        var treeId = menu340.initSelectDepthData();
        //조회 전 초기화
        xui.util.disableAll("deptDetailForm", true, true, false);
        $("#divTree01").api().init();
        //데이터 유효성 체크
        if(!menu340.validationSelectDept()){return;}
        var param	= new xui.json();
        param.setURL("/xs/vob/management/selectAuthDataUser340.json");
        param.setTreeId("divTree01");
        param.setString("userId", userId);
        param.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
        param.setTimeCheck(true);
        param.setCallBack(function(response, request){
            if(!response.getErrorFlag()){
                var unauthGroupData	= response.getDataJsonArray("UNAUTHDATA");
                // 고객사의 요청으로 법인을 기준으로 부서를 분할하여 보여줌으로 최상위 노드가 없는 경우가 발생함
                // 최상위 노드가 없는경우 트리구조에 맞도록 최상위 노드의 값을 변환한다.
                menu340.checkTopNode(unauthGroupData);
                $("#divTree01").api().loadData(unauthGroupData);

                if(response.getCount("UNAUTHDATA") > 0){
                    var unauthGroupDataLength = unauthGroupData.length;
                    for(var i = 0; i < unauthGroupDataLength ; i++){
                        mobjUnAuthUserData[unauthGroupData[i].nodeId] = unauthGroupData[i];
                    }
                }

                //  변화 전에 체크값인 변수
                var authUserData = unauthGroupData;
                Object.values(authUserData).forEach(subObj => {
                    if (subObj.checked === '1') {
                          mobjAuthUserData[subObj.nodeId] = subObj;
                    }
                });
            }else{
                xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
            }
        });
//        console.log(param);
        xui.ajax.callService(param);
    },
    initSelectDepthData : function(){
        var treeId = "";
        $("#divTree01").api().init();
        mobjAuthUserData = {};
        mobjUnAuthUserData = {};
        mobjSaveAuthUserData = [];
    },
    validationSelectDept:function(){
        return true;
    },
    // 고객사의 요청으로 법인을 기준으로 부서를 분할하여 보여줌으로 최상위 노드가 없는 경우가 발생함
    // 최상위 노드가 없는경우 트리구조에 맞도록 최상위 노드의 값을 변환한다.
    checkTopNode : function(dataList){
        if( !xui.valid.isEmpty(dataList) && dataList.length != 0 ){
            var topNode = dataList[0];
            if( topNode.parentNodeId != "*"){
                dataList[0].parentNodeId = '*';
                dataList[0].upperDeptCode = '*';
            }
        }
    },
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SAVE: 데이터 저장 처리에 대한 함수 정의 [기본함수명:saveData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	saveData : function(confirmMsg, detailMessage, dataInitAt){
		//데이터 유효성 체크
		if(!menu340.validationSaveData()){return;}

        var confirmMsg    = xui.valid.isEmpty(confirmMsg) ? xui.enum.SAVE_CONFIRM.getName() : confirmMsg;
        var detailMessage = xui.valid.isEmpty(detailMessage) ? "" : detailMessage;

        xui.dialog.confirm(detailMessage, confirmMsg, function(isConfirm){
            // 데이터 미저장 후 사용자 목록 변경시

            if(isConfirm){
                //서버에 전송할 파라미터 객체 생성
                var param	= new xui.json();
                param.setURL("/xs/vob/management/saveAuthUserData.json");									//request mapping Controller method URL
                var result = [];
                Object.values(mobjSaveAuthUserData).forEach(subObj => { for (var key in subObj) { result.push(subObj[key]); } });
//                 넘어가야 하는값 : DATA_FLAG #{puCode}, #{sapCorpCode}, #{userId}, #{sessionCompanyCode}, #{corpCode}
                param.setHeader("userId",$("#divGrid00").api().getRowData()["userId"]);
                param.setDataJsonArray(result);
                param.setString("userId",$("#divGrid00").api().getRowData()["userId"]);
                param.setAuthType(xui.enum.AUTH_TYPE_SAVE.getCode());						//요청기능 권한코드(필수)
                param.setCallBack(function(response, request){
                    if(!response.getErrorFlag()){
                        if( xui.valid.isEmpty(request.getHeader("userId")) ){
                            menu340.selectData();
                        }else{
                            menu340.selectData(request.getHeader("userId"));
                        }
                        xui.dialog.success("", response.getMsg());
                    }else{
                        xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
                    }
                });
                xui.ajax.callService(param);
            }
        });
	},
	//저장처리전 필수체크
	validationSaveData : function(){
		//프레임웍에서 지원하는 기본 유효성 체크
		//기타 개발자 정의 유효성 체크
        var checkedData  = mobjAuthUserData;
        var changedData  = $("#divTree01").api().getCheckedData();
        var checkedList = Array.isArray(checkedData) ? checkedData : Object.values(checkedData);

		// 결과 배열
        var result = [];

        // 체크 해제된 항목 → 기존엔 있었는데 현재는 없음
        if (!Array.isArray(changedData) || changedData.length === 0) {
            // 전체 체크 해제된 경우 → 전체 항목을 "checked": "0"으로 설정
            checkedList.forEach(item => {
                result.push({ ...item, checked: "0" });
            });
        } else {
            // 부분 해제 처리
            checkedList.forEach(item => {
                var stillChecked = changedData.some(cd => cd.nodeId === item.nodeId);
                if (!stillChecked) {
                    result.push({ ...item, checked: "0" });
                }
          });
        }


        // 새로 체크된 항목 → 현재는 있는데 기존에는 없었음
        if (Array.isArray(changedData) && changedData.length > 0) {
            changedData.forEach(item => {
                var alreadyChecked = Array.isArray(checkedList) && checkedList.some(cd => cd.nodeId === item.nodeId);

                if (!alreadyChecked) {
                    result.push({ ...item, checked: "1" }); // 새로 체크된 항목
                }
            });
        }


        // 결과 확인
        mobjSaveAuthUserData.push(result);

        //변경정보 노드데이터 추출
        //변경데이터 존재여부 확인 및 필수입력정보 체크
        if(xui.valid.isEmpty(mobjSaveAuthUserData)){
            xui.dialog.warning("", xui.enum.CHANGE_OBJECT_NO_EXIST.getName(), function(){
                $("#divTree01").api().focusTree();
            });
            return false;
        }


		return true;
	},
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE: 삭제 데이터 처리에 대한 함수 정의 [기본함수명:deleteData + (구분단어)]
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	deleteData : function(){
	},
	//삭제처리전 필수체크
	validationDelete : function(){
	},
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRINT: 출력 및 레포트 데이터 처리에 대한 함수 정의 [기본함수명:printData + (구분단어)]
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
	printData : function(){
        //데이터유효성 체크
        if(!menu340.validationPrintData()){return;}
    },
    validationPrintData : function(){
        return true;
    },
 // --------------------------------------------------------------------------------------------------------------------------------------------------------------
 // EXCEL: 엑셀 IMPORT / EXPORT 처리에 대한 함수 정의 [기본함수명:exportData + (구분단어) importData + (구분단어)]
 // --------------------------------------------------------------------------------------------------------------------------------------------------------------
 	exportDataExcel : function(){
	//데이터유효성 체크
        if(!menu340.validationExportDataExcel()){return;}
    },
    validationExportDataExcel : function(){
        return true;
    },

/***************************************************************************************************************************************************************
 * User Functions: 별도 화면 처리를 위해 필요한 함수를 정의한다.
 ***************************************************************************************************************************************************************/
    // PU 코드 또는 PG 코드 또는 법인 리스트를 조회한다. (콤보)(공통)(동기)
    loadManagementCombo : function(){
        var formList = [];
        formList.push($("#puCode",searchForm));
        //formList.push($("#pgCode",searchForm));
        formList.push($("#corpCode",searchForm));
        var param = new xui.json();

        var comboData = vobCmmn.loadManagementCombo(formList,param);

        comboData = null;
    },

    // Team 팝업 검색 (공통)(Grid)
    getManagementTeamGrid : function(form, clickIcon){

        var param = new xui.json();
        var elementNumber = "";
        var ids   = {
            info     : "deptInfo" + elementNumber,
            code     : "deptCode" + elementNumber,
            name     : "deptName" + elementNumber
        };
        param.setBoolean("autoSearch", true);
        vobCmmn.getManagementTeamGrid(form, clickIcon, param, ids);
    },

	/**
	* 그리드 셀 중 디자인 적용을 위한 데이터 컨버전
	* @param {string} rowIdx 로우 IDX
	* @param {string} rowId 로우 ID
	* @param {string} rowData 로우 데이터
	* @param {string} cellIdx 셀 IDX 값
	* @param {string} cellId 셀 IDX 값
	* @retrun 없음
	*/
	convertData : function(rowIdx, rowId, rowData, cellIdx, cellId){
		var returnValue = rowData[cellId];

		if(cellId === "deptName"){
		    returnValue	= "<div xui-tooltip-title='"+rowData.fullDeptName+"'>"+returnValue+"</div>";
		}

		return returnValue;
	},

	loadDeptLanguage : function(){
        var innerDeptNameHTML      = "";
        var innerDeptShortNameHTML = "";
        var languageCodes          = xui.syscode.get("SYS028");
        // 현재 선택된 언어만 필수적으로 validation check하도록 변경
        var sessionLanguageCode    = xui.extends.session.sessionInfo.LANGUAGE_CODE;

        for(var i=0;i<languageCodes.length;i++){
            var requiredValue = languageCodes[i].code === sessionLanguageCode ? "required" : "";

            innerDeptNameHTML += '<div class="row">';
            innerDeptNameHTML += '<div class="cell s6">';
            innerDeptNameHTML += '<span class="th '+requiredValue+'" message-text="deptName_'+ languageCodes[i].code +'">부서명</span>';
            innerDeptNameHTML += '<label class="xui-input-label">';
            innerDeptNameHTML += '<input type="text" class="'+requiredValue+'" id="deptName'+ basic020.capitalizeFirstLetter(languageCodes[i].code) +'" name="deptName' + basic020.capitalizeFirstLetter(languageCodes[i].code) + '" message-tooltip="deptName_'+ languageCodes[i].code +'" xui-tooltip-title="부서명" message-placeholder="deptName_'+ languageCodes[i].code +'" placeholder="부서명"/>';
            innerDeptNameHTML += '</label>';
            innerDeptNameHTML += '</div>';
            innerDeptNameHTML += '</div>';

            innerDeptShortNameHTML += '<div class="row">';
            innerDeptShortNameHTML += '<div class="cell s6">';
            innerDeptShortNameHTML += '<span class="th" message-text="deptShortName_'+ languageCodes[i].code +'">부서약어명</span>';
            innerDeptShortNameHTML += '<label class="xui-input-label">';
            innerDeptShortNameHTML += '<input type="text" class="" id="deptShortName'+ basic020.capitalizeFirstLetter(languageCodes[i].code) +'" name="deptShortName' + basic020.capitalizeFirstLetter(languageCodes[i].code) + '" message-tooltip="deptShortName_'+ languageCodes[i].code +'" xui-tooltip-title="부서약어명" message-placeholder="deptShortName_'+ languageCodes[i].code +'" placeholder="부서약어명"/>';
            innerDeptShortNameHTML += '</label>';
            innerDeptShortNameHTML += '</div>';
            innerDeptShortNameHTML += '</div>';
        }

        $("#divDeptNameWrap").html(innerDeptNameHTML);
        $("#divDeptShortNameWrap").html(innerDeptShortNameHTML);
        xui.com.elementScan($("#divDeptNameWrap"));
        xui.com.elementScan($("#divDeptShortNameWrap"));
        xui.com.elementLabelScan($("#divDeptNameWrap"));
        xui.com.elementLabelScan($("#divDeptShortNameWrap"));
    },

    // 법인회사 변경시 선택한 Team정보를 초기화한다.
	changeCorpCode : function(){
	    $("#deptInfo").valExt("");
	    $("#deptCode").valExt("");
	    $("#deptName").valExt("");
	},

	// 첫글자를 대문자로 바꿔주는 함수
    capitalizeFirstLetter : function(str) {
        return str.replace(/^./, (char) => char.toUpperCase());
    },

	/**
	 * Sample(해당 함수는 삭제하지 말고 그대로)
	 */
	sample : function(){
	}
};