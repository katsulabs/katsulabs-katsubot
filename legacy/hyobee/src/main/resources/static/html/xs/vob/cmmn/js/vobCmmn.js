"use strict";

class _vobCmmn {
    constructor() {
		this.enum	= new Enumeration();
		this.enum.setEnum("name"						,"code"			,"codeName"							,"pcode");
		this.enum.setEnum("NO_CONTENTS_KEY"				,"WARNING"		,"xui.NO_CONTENTS_INFO"				,"");
		this.enum.setEnum("NO_KEYWORD"					,"WARNING"		,"dashboard010.NO_KEYWORD"			,"");
        this.enum.setEnum("NO_KEYWORD_LENGTH"			,"WARNING"		,"dashboard010.NO_KEYWORD_LENGTH"	,"");
        this.enum.setEnum("END_OPERATOR_KEYWORD"		,"WARNING"		,"END_OPERATOR_KEYWORD"	            ,"");
		this.enum.setEnum("NO_QUESTION_KEY"				,"WARNING"		,"SEARCH_VALID_004"					,"");
		// 업무요청처리상태(VOB045)
		this.enum.setEnum("STS_REQST", 					"010"			, "요청"								, "");
		this.enum.setEnum("STS_RECPT", 					"020"			, "접수"								, "");
		this.enum.setEnum("STS_DEPLY", 					"030"			, "적용"								, "");
		this.enum.setEnum("STS_REJCT", 					"040"			, "반려"								, "");

		this.enum.setEnum("EMPTY_PROMPT_KEY"			, "필수확인"		, "프롬프트키가 없습니다."				, "");
	}

	// 부서정보팝업 ( 과거 com_dept table 바라봄 ) 사용 안한다면 제거해야함.
	getDeptKeyInfo (form, clickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	: "deptInfo",
				id 		: "deptCode",
				name 	: "deptName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var popupParam 	= {"deptInfo":inputValue};
		if(clickIcon){
			xui.extends.popup.openDeptPop({param:popupParam,"height":800}, function(response){
				if(xui.valid.isArray(response) && response.length > 0){
					$("#" + ids.info, form).valExt(response[0].deptName);
					$("#" + ids.id, form).valExt(response[0].deptCode);
					$("#" + ids.name, form).valExt(response[0].deptName);
				}
			});
		}else {
			if(inputValue === $("#" + ids.name, form).valExt()) return;
			if(xui.valid.isEmpty(inputValue)){
				$("#" + ids.id, form).valExt("");
				$("#" + ids.name, form).valExt("");
				if(autoSearch){
					callBack();
				}
			} else {
				xui.extends.search.searchDept(inputValue, "Y", function(response){
					if(!response.getErrorFlag()){
						 if(response.getCount() === 1){
							$("#" + ids.info, form).valExt(response.getString("deptName"));
							$("#" + ids.id, form).valExt(response.getString("deptCode"));
							$("#" + ids.name, form).valExt(response.getString("deptName"));
							if(autoSearch){callBack();}
						 } else {
							xui.extends.popup.openDeptPop({param:popupParam}, function(response){
								if(xui.valid.isArray(response) && response.length > 0){
									$("#" + ids.info, form).valExt(response[0].deptName);
									$("#" + ids.id, form).valExt(response[0].deptCode);
									$("#" + ids.name, form).valExt(response[0].deptName);
									if(autoSearch){callBack();}
								}
							});
						}
					}
				});
			}
		}
	}

    /**
	 * 조회 및 저장 화면에서 사용자정보 조회기능(이름/아이디검색, 팝업, 자동입력 등)의 기능을 제공하는 공통함수 TREE 형태
	 *  1. 입력한 사용자 정보가 1건일 경우 자동으로 설정되는 기능 (숨김 INPUT박스에 ID와 이름 자동 설정)
	 *  2. 입력한 사용자 정보가 0건 또는 N건일 경우 자동으로 팝업화면을 호출하여 입력할 수 있는 기능 제공
	 *  3. 직접 팝업화면을 호출하여 사용자정보를 조회하고 입력할 수 있는 기능 제공
	 * @param	form 폼객체 ID (객체)
	 * @param	clickIcon 클릭아이콘을 통한 클릭여부
	 * @param	param xui.json타입의 사용자 정의 파라메터 1.autoSearch: 자동검색여부(true일 경우 반드시 setCallBack을 정의해야함)
	 * @param	ids 화면에 존재하는 3개의 ID 정의 (미정의 시 기본 값으로 설정)
	 * @returns	없음
	 */
	getUserKeyInfo (form, isClickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	: "userInfo",
				id 		: "userId",
				name 	: "userName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var popupParam 	= {"userInfo":inputValue};
		if(isClickIcon){
			xui.extends.popup.openDeptUserPop({param:popupParam}, function(response){
				if(xui.valid.isArray(response) && response.length > 0){
					$("#" + ids.info, form).valExt(response[0].userName);
					$("#" + ids.id, form).valExt(response[0].userId);
					$("#" + ids.name, form).valExt(response[0].userName);
				}
			});
		}else {
			if(inputValue === $("#" + ids.name, form).valExt()) return;
			if(xui.valid.isEmpty(inputValue)){
				$("#" + ids.id, form).valExt("");
				$("#" + ids.name, form).valExt("");
				if(autoSearch){
					callBack();
				}
			} else {
				xui.extends.search.searchUser(inputValue, "Y", function(response){
					if(!response.getErrorFlag()){
						 if(response.getCount() === 1){
							$("#" + ids.info, form).valExt(response.getString("userName"));
							$("#" + ids.id, form).valExt(response.getString("userId"));
							$("#" + ids.name, form).valExt(response.getString("userName"));
							if(autoSearch){
								callBack();
							}
						 } else {
							xui.extends.popup.openDeptUserPop({param:popupParam}, function(response){
								if(xui.valid.isArray(response) && response.length > 0){
									$("#" + ids.info, form).valExt(response[0].userName);
									$("#" + ids.id, form).valExt(response[0].userId);
									$("#" + ids.name, form).valExt(response[0].userName);
									if(autoSearch){
										callBack();
									}
								}
							});
						}
					}
				});
			}
		}
	}

    /**
	 * 조회 및 저장 화면에서 사용자정보 조회기능(이름/아이디검색, 팝업, 자동입력 등)의 기능을 제공하는 공통함수 GRID 형태
	 *  1. 입력한 사용자 정보가 1건일 경우 자동으로 설정되는 기능 (숨김 INPUT박스에 ID와 이름 자동 설정)
	 *  2. 입력한 사용자 정보가 0건 또는 N건일 경우 자동으로 팝업화면을 호출하여 입력할 수 있는 기능 제공
	 *  3. 직접 팝업화면을 호출하여 사용자정보를 조회하고 입력할 수 있는 기능 제공
	 * @param	form 폼객체 ID (객체)
	 * @param	clickIcon 클릭아이콘을 통한 클릭여부
	 * @param	param xui.json타입의 사용자 정의 파라메터 1.autoSearch: 자동검색여부(true일 경우 반드시 setCallBack을 정의해야함)
	 * @param	ids 화면에 존재하는 3개의 ID 정의 (미정의 시 기본 값으로 설정)
	 * @returns	없음
	 */
	getUserGrid (form, isClickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	: "userInfo",
				id 		: "userId",
				name 	: "userName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var popupParam 	= {"userInfo":inputValue};
		if(isClickIcon){
			xui.extends.popup.openUserPop({param:popupParam}, function(response){
				if(!xui.valid.isEmpty(response)){
					$("#" + ids.info, form).valExt(response.userName);
					$("#" + ids.id, form).valExt(response.userId);
					$("#" + ids.name, form).valExt(response.userName);
				}else{
				    // 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
				    if(xui.valid.isEmpty($("#" + ids.id, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
				}
				if(autoSearch){
					callBack();
				}
			});
		}else {
			if(inputValue === $("#" + ids.name, form).valExt()) return;
			if(xui.valid.isEmpty(inputValue)){
				$("#" + ids.id, form).valExt("");
				$("#" + ids.name, form).valExt("");
				if(autoSearch){
					callBack();
				}
			} else {
				xui.extends.search.searchUser(inputValue, "Y", function(response){
					if(!response.getErrorFlag()){
						 if(response.getCount() === 1){
							$("#" + ids.info, form).valExt(response.getString("userName"));
							$("#" + ids.id, form).valExt(response.getString("userId"));
							$("#" + ids.name, form).valExt(response.getString("userName"));
							if(autoSearch){
								callBack();
							}
						 } else {
							xui.extends.popup.openUserPop({param:popupParam}, function(response){
							    if(!xui.valid.isEmpty(response)){
                                    if(xui.valid.isJson(response)){
                                        $("#" + ids.info, form).valExt(response.userName);
                                        $("#" + ids.id, form).valExt(response.userId);
                                        $("#" + ids.name, form).valExt(response.userName);
                                    } else if(xui.valid.isArray(response) && response.length > 0){
                                        $("#" + ids.info, form).valExt(response[0].userName);
                                        $("#" + ids.id, form).valExt(response[0].userId);
                                        $("#" + ids.name, form).valExt(response[0].userName);
                                    }

                                    if(autoSearch){
                                        callBack();
                                    }
                                }else{
                            	    // 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                                    if(xui.valid.isEmpty($("#" + ids.id, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                                }
							});
						}
					}
				});
			}
		}
	}

    /**
	 * 조회 및 저장 화면에서 고객정보 조회기능(이름/아이디검색, 팝업, 자동입력 등)의 기능을 제공하는 공통함수 GRID 형태
	 *  1. 입력한 사용자 정보가 1건일 경우 자동으로 설정되는 기능 (숨김 INPUT박스에 ID와 이름 자동 설정)
	 *  2. 입력한 사용자 정보가 0건 또는 N건일 경우 자동으로 팝업화면을 호출하여 입력할 수 있는 기능 제공
	 *  3. 직접 팝업화면을 호출하여 사용자정보를 조회하고 입력할 수 있는 기능 제공
	 * @param	form 폼객체 ID (객체)
	 * @param	clickIcon 클릭아이콘을 통한 클릭여부
	 * @param	param xui.json타입의 사용자 정의 파라메터 1.autoSearch: 자동검색여부(true일 경우 반드시 setCallBack을 정의해야함)
	 * @param	ids 화면에 존재하는 3개의 ID 정의 (미정의 시 기본 값으로 설정)
	 * @returns	없음
	 */
	getCustomerGrid (form, isClickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	    : "custInfo",
				puCode 		: "puCode",
				code    	: "custCode",
				name        : "custName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var puCode      = $("#" + ids.puCode, form).valExt();
		var popupParam 	= {"custInfo":inputValue,"puCode":puCode};
		if(isClickIcon){
			xui.extends.popup.openCustomerPop({param:popupParam}, function(response){
				if(!xui.valid.isEmpty(response)){
					$("#" + ids.info, form).valExt(response.custName);
					$("#" + ids.code, form).valExt(response.custCode);
					$("#" + ids.name, form).valExt(response.custName);
				}else{
                    // 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                    if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                }
			});
		}else {
			if(inputValue === $("#" + ids.name, form).valExt()) return;
			if(xui.valid.isEmpty(inputValue)){
                $("#" + ids.code, form).valExt("");
                $("#" + ids.name, form).valExt("");
				if(autoSearch){
					callBack();
				}
			} else {
			    var searchParam = {"custInfo":inputValue,"puCode":puCode};
				xui.extends.search.searchCustomer(searchParam, function(response){
					if(!response.getErrorFlag()){
						 if(response.getCount() === 1){
							$("#" + ids.info, form).valExt(response.getString("custName"));
							$("#" + ids.code, form).valExt(response.getString("custCode"));
							$("#" + ids.name, form).valExt(response.getString("custName"));
							if(autoSearch){
								callBack();
							}
						 } else {
							xui.extends.popup.openCustomerPop({param:popupParam}, function(response){
								if(!xui.valid.isEmpty(response)){
                                    $("#" + ids.info, form).valExt(response.custName);
                                    $("#" + ids.code, form).valExt(response.custCode);
                                    $("#" + ids.name, form).valExt(response.custName);
									if(autoSearch){
										callBack();
									}
								}else{
                                    // 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                                     if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                                }
							});
						}
					}
				});
			}
		}
	}

    /**
	 * 조회 및 저장 화면에서 Team정보 조회기능(이름/아이디검색, 팝업, 자동입력 등)의 기능을 제공하는 공통함수 GRID 형태
	 *  1. 입력한 사용자 정보가 1건일 경우 자동으로 설정되는 기능 (숨김 INPUT박스에 ID와 이름 자동 설정)
	 *  2. 입력한 사용자 정보가 0건 또는 N건일 경우 자동으로 팝업화면을 호출하여 입력할 수 있는 기능 제공
	 *  3. 직접 팝업화면을 호출하여 사용자정보를 조회하고 입력할 수 있는 기능 제공
	 * @param	form 폼객체 ID (객체)
	 * @param	clickIcon 클릭아이콘을 통한 클릭여부
	 * @param	param xui.json타입의 사용자 정의 파라메터 1.autoSearch: 자동검색여부(true일 경우 반드시 setCallBack을 정의해야함)
	 * @param	ids 화면에 존재하는 3개의 ID 정의 (미정의 시 기본 값으로 설정)
	 * @returns	없음
	 */
	getTeamGrid (form, isClickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	    : "deptInfo",
				code    	: "deptCode",
				name        : "deptName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var popupParam 	= {"deptInfo":inputValue};
		if(isClickIcon){
		    xui.extends.popup.openTeamPop({param:popupParam}, function(response){
                if(!xui.valid.isEmpty(response)){
                    $("#" + ids.info, form).valExt(xui.util.restoreXSS(response.deptName));
                    $("#" + ids.code, form).valExt(response.deptCode);
                    $("#" + ids.name, form).valExt(xui.util.restoreXSS(response.deptName));
                }else{
                 	// 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                 	if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                 }
            });
		}else{
		    if(inputValue === $("#" + ids.name, form).valExt()) return;
		    xui.extends.popup.openTeamPop({param:popupParam}, function(response){
                if(!xui.valid.isEmpty(response)){
                    $("#" + ids.info, form).valExt(xui.util.restoreXSS(response.deptName));
                    $("#" + ids.code, form).valExt(response.deptCode);
                    $("#" + ids.name, form).valExt(xui.util.restoreXSS(response.deptName));
                }else{
                 	// 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                 	if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                 }
                if(autoSearch){
                    callBack();
                }
            });
		}
	}

    /**
	 * 조회 및 저장 화면에서 Team정보 조회기능(이름/아이디검색, 팝업, 자동입력 등)의 기능을 제공하는 공통함수 GRID 형태
	 *  1. 입력한 사용자 정보가 1건일 경우 자동으로 설정되는 기능 (숨김 INPUT박스에 ID와 이름 자동 설정)
	 *  2. 입력한 사용자 정보가 0건 또는 N건일 경우 자동으로 팝업화면을 호출하여 입력할 수 있는 기능 제공
	 *  3. 직접 팝업화면을 호출하여 사용자정보를 조회하고 입력할 수 있는 기능 제공
	 * @param	form 폼객체 ID (객체)
	 * @param	clickIcon 클릭아이콘을 통한 클릭여부
	 * @param	param xui.json타입의 사용자 정의 파라메터 1.autoSearch: 자동검색여부(true일 경우 반드시 setCallBack을 정의해야함)
	 * @param	ids 화면에 존재하는 3개의 ID 정의 (미정의 시 기본 값으로 설정)
	 * @returns	없음
	 */
	getAuthorGrid (form, isClickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	    : "authorInfo",
				code    	: "authorCode",
				name        : "authorName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var popupParam 	= {"author":inputValue};
		if(isClickIcon){
		    xui.extends.popup.openAuthorPop({param:popupParam}, function(response){
                if(!xui.valid.isEmpty(response)){
                    $("#" + ids.info, form).valExt(response.userName);
                    $("#" + ids.code, form).valExt(response.userId);
                    $("#" + ids.name, form).valExt(response.userName);
                }else{
                 	// 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                 	if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                 }
            });
		}else{
		    if(inputValue === $("#" + ids.name, form).valExt()) return;
		    xui.extends.popup.openAuthorPop({param:popupParam}, function(response){
                if(!xui.valid.isEmpty(response)){
                    $("#" + ids.info, form).valExt(response.userName);
                    $("#" + ids.code, form).valExt(response.userId);
                    $("#" + ids.name, form).valExt(response.userName);
                }else{
                 	// 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                 	if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                 }
                if(autoSearch){
                    callBack();
                }
            });
		}
	}

	// 세션에 저장된 USER ID 정보를 이용하여 사용자의 권한을 기준으로 PU CODE 또는 PG CODE 정보를 조회하고 콤보에 로드
	// (공통)(콤보)(동기)
	loadPuPgCombo(formList, param){
	    if((!xui.valid.isEmpty(formList) && Array.isArray(formList))){
	        var callBack = param.getCallBack();
            var params   = new xui.json();
            params.setURL("/xs/core/api/selectPuPgInfo.json");
            params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
            params.setString("userId",xui.extends.session.getUserId());
            params.setString("puCode",param.getString("puCode"));
            params.setString("formList",formList.map((element)=>element.attr('id')).toString());
            var response	=	xui.ajax.callSync(params);
            if(!response.getErrorFlag()){
                var puCodeElement = formList.filter((item)=>item.attr("id")=== "puCode")[0];
                params.setString("puCode",param.getString("puCode"));
                // 최초 puCodeList 로드시 element를 그린다.
                if( puCodeElement.api().config.options.length === 0 ){
                    xui.util.drawCombo(puCodeElement, xui.util.getTreeData(response.getDataJsonArray("puList"), "*****", "nodeId", "parentNodeId"));
                    // 전달된 puCode 값이 존재하지 않는 경우 첫번쨰 pu의 값을 설정한다.
                    if( xui.valid.isEmpty(param.getString("puCode")) ){
                        params.setString("puCode",response.getDataJsonObject("puList",0).code);
                    }
                }

                // FormList에서 PuCode에 해당하는 Element를 제외한다.
                formList = formList.filter((item) => ( item.attr('id') != "puCode" ) );

                if( formList.length > 0 ){
                    // puCode에 의해 변화되는 Element의 값을 초기화 하도록 callback function을 호출한다.
                    if(!xui.valid.isEmpty(callBack)){ callBack(); }
                    vobCmmn.loadSearchCombo(formList, params);
                }
            }else{
                xui.dialog.error(response.getMsg(), "ERROR");
            }
	    }
	}

	// PU 코드에 따라 변경 되는 조회 Combo List를 조회한다.
	// (공통)(콤보)(동기)
	loadSearchCombo(formList, param){
        if(!xui.valid.isEmpty(param.getString("puCode"))){
            var params      = new xui.json();
            params.setURL("/xs/core/api/selectSearchCombo.json");
            params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
            params.setString("formList",formList.map((element)=>element.attr('id')).toString());
            params.setString("puCode",param.getString("puCode"));
			var response	=	xui.ajax.callSync(params);
			if(!response.getErrorFlag()){
				if(!xui.valid.isEmpty(response.getDataJsonObject("corpCode"))){
					var corpCodeElement = formList.filter((item)=>item.attr("id")=== "corpCode")[0];
					xui.util.drawCombo(corpCodeElement, xui.util.getTreeData(response.getDataJsonArray("corpCode"), "*****", "nodeId", "parentNodeId"));
					// select combo load시 전체 선택되도록 설정.
					corpCodeElement.valExt(response.getDataJsonArray("corpCode").map(item => item.code));
				}
				if(!xui.valid.isEmpty(response.getDataJsonObject("categoryCode"))){
					var categoryCodeElement = formList.filter((item)=>item.attr("id")=== "categoryCode")[0];
					xui.util.drawCombo(categoryCodeElement, xui.util.getTreeData(response.getDataJsonArray("categoryCode"), "*****", "nodeId", "parentNodeId"));
					// select combo load시 전체 선택되도록 설정.
					categoryCodeElement.valExt(response.getDataJsonArray("categoryCode").map(item => item.code));
				}
			}else{
				xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
			}
        }
	}

    // 데이터권한과 무관하게 마케팅 임직원(VOB049)이 작성한 PU를 기준으로 콤보박스 생성
    // (공통)(콤보)(동기)
    loadPuPgComboMarketing(formList, param){
        if((!xui.valid.isEmpty(formList) && Array.isArray(formList))){
            var callBack = param.getCallBack();
            var params   = new xui.json();
            params.setURL("/xs/core/api/selectPuPgMarketingInfo.json");
            params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
            params.setString("puCode",param.getString("puCode"));
            params.setString("formList",formList.map((element)=>element.attr('id')).toString());
            var response	=	xui.ajax.callSync(params);
            if(!response.getErrorFlag()){
                var puCodeElement = formList.filter((item)=>item.attr("id")=== "puCode")[0];
                params.setString("puCode",param.getString("puCode"));
                // 최초 puCodeList 로드시 element를 그린다.
                if( puCodeElement.api().config.options.length === 0 ){
                    xui.util.drawCombo(puCodeElement, xui.util.getTreeData(response.getDataJsonArray("puList"), "*****", "nodeId", "parentNodeId"));
                    // 전달된 puCode 값이 존재하지 않는 경우 첫번쨰 pu의 값을 설정한다.
                    if( xui.valid.isEmpty(param.getString("puCode")) ){
                        params.setString("puCode",response.getDataJsonObject("puList",0).code);
                    }
                }

                // FormList에서 PuCode에 해당하는 Element를 제외한다.
                formList = formList.filter((item) => ( item.attr('id') != "puCode" ) );

                if( formList.length > 0 ){
                    // puCode에 의해 변화되는 Element의 값을 초기화 하도록 callback function을 호출한다.
                    if(!xui.valid.isEmpty(callBack)){ callBack(); }
                    vobCmmn.loadSearchComboMarketing(formList, params);
                }
            }else{
                xui.dialog.error(response.getMsg(), "ERROR");
            }
        }
    }

	// PU 코드에 따라 변경 되는 조회 Combo List를 조회한다.
	// (공통)(콤보)(동기)
	loadSearchComboMarketing(formList, param){
        if(!xui.valid.isEmpty(param.getString("puCode"))){
            var params      = new xui.json();
            params.setURL("/xs/core/api/selectSearchComboMarketing.json");
            params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
            params.setString("formList",formList.map((element)=>element.attr('id')).toString());
            params.setString("puCode",param.getString("puCode"));
			var response	=	xui.ajax.callSync(params);
			if(!response.getErrorFlag()){
				if(!xui.valid.isEmpty(response.getDataJsonObject("corpCode"))){
					var corpCodeElement = formList.filter((item)=>item.attr("id")=== "corpCode")[0];
					xui.util.drawCombo(corpCodeElement, xui.util.getTreeData(response.getDataJsonArray("corpCode"), "*****", "nodeId", "parentNodeId"));
					// select combo load시 전체 선택되도록 설정.
					corpCodeElement.valExt(response.getDataJsonArray("corpCode").map(item => item.code));
				}
				if(!xui.valid.isEmpty(response.getDataJsonObject("categoryCode"))){
					var categoryCodeElement = formList.filter((item)=>item.attr("id")=== "categoryCode")[0];
					xui.util.drawCombo(categoryCodeElement, xui.util.getTreeData(response.getDataJsonArray("categoryCode"), "*****", "nodeId", "parentNodeId"));
					// select combo load시 전체 선택되도록 설정.
					categoryCodeElement.valExt(response.getDataJsonArray("categoryCode").map(item => item.code));
				}
			}else{
				xui.dialog.error(response.getMsg(), xui.enum.ERROR.getName());
			}
        }
	}

	// 세션에 저장된 USER ID 정보를 이용하여 사용자의 권한을 기준으로 PU CODE 또는 PG CODE 정보를 조회하고 콤보에 로드
	// 공통 조회 영역 외 콤보를 그려야할 경우 조회 결과 값을 받아서 개별 화면에서 그린다. ( basic010.js 참조 )
	// (공통)(콤보)(동기)
	loadManagementCombo(formList, param){
	    if((!xui.valid.isEmpty(formList) && Array.isArray(formList))){
	        var callBack = param.getCallBack();
            var params   = new xui.json();
            params.setURL("xs/vob/management/selectManagementCombo.json");
            params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
            params.setString("formList",formList.map((element)=>element.attr('id')).toString());
            var response	=	xui.ajax.callSync(params);
            if(!response.getErrorFlag()){
                // 최초 puCodeList 로드시
                if( params.getString("formList").toString().indexOf("puCode") > -1 ){
                    var puCodeElement = formList.filter((item)=>item.attr("id")=== "puCode")[0];
                    xui.util.drawCombo(puCodeElement, xui.util.getTreeData(response.getDataJsonArray("puList"), "*****", "nodeId", "parentNodeId"));
                }
                // 전달된 formList에 pgCode가 존재시
                if(params.getString("formList").toString().indexOf("pgCode") > -1 ){
                    var pgCodeElement = formList.filter((item)=>item.attr("id")=== "pgCode")[0];
                    xui.util.drawCombo(pgCodeElement, xui.util.getTreeData(response.getDataJsonArray("pgList"), "*****", "nodeId", "parentNodeId"));
                }
                // 전달된 formList에 corpCode가 존재시
                if(params.getString("formList").toString().indexOf("corpCode") > -1 ){
                    var corpCodeElement = formList.filter((item)=>item.attr("id")=== "corpCode")[0];
                    xui.util.drawCombo(corpCodeElement, xui.util.getTreeData(response.getDataJsonArray("corpCode"), "*****", "nodeId", "parentNodeId"));
                    // select combo load시 전체 선택되도록 설정.
                    corpCodeElement.valExt(response.getDataJsonArray("corpCode").map(item => item.code));
                }
                return response;
            }else{
                xui.dialog.error(response.getMsg(), "ERROR");
            }
	    }
	}

	// PU에 매핑된 법인회사를 조회하는 콤보
	loadCorpComboByPu(formList, param){
	    if((!xui.valid.isEmpty(formList) && Array.isArray(formList))){
	        var callBack = param.getCallBack();
            var params   = new xui.json();
            params.setURL("xs/vob/management/selectCorpComboByPu.json");
            params.setString("puCode", param.getString("puCode"));
            params.setAuthType(xui.enum.AUTH_TYPE_SELECT.getCode());
            params.setString("formList",formList.map((element)=>element.attr('id')).toString());
            var response	=	xui.ajax.callSync(params);
            if(!response.getErrorFlag()){
				var corpCodeElement = formList.filter((item)=>item.attr("id")=== "corpCode")[0];
				xui.util.drawCombo(corpCodeElement, xui.util.getTreeData(response.getDataJsonArray("corpCode"), "*****", "nodeId", "parentNodeId"));
				corpCodeElement.valExt(response.getDataJsonArray("corpCode").map(item => item.code));
                return response;
            }else{
                xui.dialog.error(response.getMsg(), "ERROR");
            }
	    }
	}

    /**
	 * 조회 및 저장 화면에서 Team정보 조회기능(이름/아이디검색, 팝업, 자동입력 등)의 기능을 제공하는 공통함수 GRID 형태
	 *  1. 입력한 사용자 정보가 1건일 경우 자동으로 설정되는 기능 (숨김 INPUT박스에 ID와 이름 자동 설정)
	 *  2. 입력한 사용자 정보가 0건 또는 N건일 경우 자동으로 팝업화면을 호출하여 입력할 수 있는 기능 제공
	 *  3. 직접 팝업화면을 호출하여 사용자정보를 조회하고 입력할 수 있는 기능 제공
	 * @param	form 폼객체 ID (객체)
	 * @param	clickIcon 클릭아이콘을 통한 클릭여부
	 * @param	param xui.json타입의 사용자 정의 파라메터 1.autoSearch: 자동검색여부(true일 경우 반드시 setCallBack을 정의해야함)
	 * @param	ids 화면에 존재하는 3개의 ID 정의 (미정의 시 기본 값으로 설정)
	 * @returns	없음
	 */
	getManagementTeamGrid (form, isClickIcon, param, ids){
		if(xui.valid.isEmpty(ids)) {
			ids = {
				info 	    : "deptInfo",
				code    	: "deptCode",
				name        : "deptName"
			};
		}
		var callBack 	= param.getCallBack();
		var autoSearch 	= param.getString("autoSearch") && typeof(callBack) === "function";
		var inputValue	= $("#" + ids.info, form).valExt();
		var popupParam 	= {"deptInfo":inputValue,"managementAt":"Y"};
		if(isClickIcon){
		    xui.extends.popup.openTeamPop({param:popupParam,popName:"Management"}, function(response){
                if(!xui.valid.isEmpty(response)){
                    $("#" + ids.info, form).valExt(xui.util.restoreXSS(response.deptName));
                    $("#" + ids.code, form).valExt(response.deptCode);
                    $("#" + ids.name, form).valExt(xui.util.restoreXSS(response.deptName));
                }else{
                 	// 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                 	if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                }
            });
		}else{
		    if(inputValue === $("#" + ids.name, form).valExt()) return;
		    xui.extends.popup.openTeamPop({param:popupParam,popName:"Management"}, function(response){
                if(!xui.valid.isEmpty(response)){
                    $("#" + ids.info, form).valExt(xui.util.restoreXSS(response.deptName));
                    $("#" + ids.code, form).valExt(response.deptCode);
                    $("#" + ids.name, form).valExt(xui.util.restoreXSS(response.deptName));
                }else{
                 	// 이전에 검색한 데이터가 존재하지 않는다면 사용자가 입력한 검색어를 클리어한다.
                 	if(xui.valid.isEmpty($("#" + ids.code, form).valExt())){ $("#" + ids.info, form).valExt(''); return; }
                }
                if(autoSearch){
                    callBack();
                }
            });
		}
	}

	stringToObject(inputString) {
		if(xui.valid.isEmpty(inputString)){
			return {};
		}
	    const keyValuePairs = inputString.split(',');
	    const resultObject = {};

	    keyValuePairs.forEach(pair => {
	        const [key, value] = pair.split('=');
	        resultObject[key.trim()] = value.trim();
	    });

	    return resultObject;
	}


	/**
	 * TextArea 높이를 동적으로 늘리거나 줄여줌 / TextArea의 keydown, keyup 이벤트에서 호출
	 * @param {tagElemnet} element 댓글텍스트영역객체
	 * @returns	없음
	 */
	sizingTextArea(element) {
		var textarea = $(element);

        // 댓글 입력 영역의 높이를 동적으로 늘려준다.
        textarea.height(1).height(textarea.prop('scrollHeight') - 8);
	}

	/**
	 * 스크롤이동에 따른 최상단 진행바 색을 칠한다.
	 * @param {string} rootWrapperId 최상위 엘리먼트 ID
	 * @param {string} progressBarId 진행바 ID
	 * @returns	없음
	 */
	fillProgressBar(rootWrapperId, progressBarId) {
		try{
			var rootWrapper = $("#" + rootWrapperId);
			var scrollPosition = rootWrapper.scrollTop();
			var totalHeight = rootWrapper.prop("scrollHeight") - rootWrapper.prop("clientHeight");
			var scrollRate = (scrollPosition / totalHeight) * 100;
			$("#" + progressBarId).css("width", scrollRate + "%");
		} catch(e){
		}
	}

	 /**
	 * targetElement 의 크기에 맞춰 DOM Element Body 태그의 크기를 조정, 프린트 후 크기를 원복합니다.
	 * @param	{string} targetElementId 출력기준 엘리먼트 ID
	 */
	printData(targetElementId){
		var bodyHeight = $("body").height();
		$("body").css("height",$("#" + targetElementId).prop("scrollHeight"));
		window.print($("#" + targetElementId).html());
		$("body").css("height",bodyHeight);
	}


	/**
	 * 검색 창의 날짜 버튼에 따라 날짜를 계산하여, 적용합니다.
	 * @param {object} element 클릭한 버튼 엘리먼트
	 * @param {string} dateFromId 시작일 ID
	 * @param {string} dateToId 종료일 ID
	 * @param {object} formElement 폼객체
	 * @param {boolean} isMonth 월기준여부
	 * @retrun 없음
	 */
	setDate(element, dateFromId, dateToId, formElement, isMonth){
		var stdDateFrom = "";
		var stdDateTo = "";
		var today = xui.dateutil.getToday(false);
		var thisMonth = today.substring(4,6);
		var thisYear = today.substring(0,4);
		if(xui.valid.isEmpty(isMonth)){isMonth = false;}

		switch(element.text()){
			case "오늘"		:
				stdDateFrom = today;
				stdDateTo = today;
				break;
			case "어제"		:
				stdDateFrom = xui.dateutil.getCalc(today, "d", -1, "");
				stdDateTo = xui.dateutil.getCalc(today, "d", -1, "");
				break;
			case "금주"	:
				stdDateFrom = xui.dateutil.getThisWeekBegin("yyyymmdd");
				stdDateTo =  xui.dateutil.getThisWeekEnd("yyyymmdd");
				break;
			case "당월"	:
			case "ThisMonth"	:
			case "本月"	:
				stdDateFrom = today.substring(0,6) + "01";
				stdDateTo = xui.dateutil.getLastDay(today, false);
				break;
			case "1개월"	:
				stdDateFrom = xui.dateutil.getCalc(today, "M", -1, "");
				stdDateTo = today
				break;
			case "2개월"	:
			case "2M"	:
			case "2月"	:
			case "2Months"	:
				stdDateFrom = xui.dateutil.getCalc(today, "M", -2, "");
				stdDateTo = today
				break;
			case "3개월"	:
			case "3M"		:
			case "3月"	:
				stdDateFrom = xui.dateutil.getCalc(today, "M", -3, "");
				stdDateTo = today
				break;
			case "6개월"	:
			case "6M"		:
			case "6月"	:
				stdDateFrom =xui.dateutil.getCalc(today, "M", -6, "");
				stdDateTo = today
				break;
			case "12개월"	:
			case "12M"		:
			case "12月"	:
				stdDateFrom =xui.dateutil.getCalc(today, "M", -12, "");
				stdDateTo = today
				break;
			case "당해년"	:
				stdDateFrom =xui.dateutil.getCalc(today, "Y", -1, "");
				stdDateTo = today
				break;
			case "1년"	:
				stdDateFrom = xui.dateutil.getCalc(today, "y", -1, "");
				stdDateTo = today
				break;
			case "이번분기"	:
				var startDate = "";
				var endDate = "";
				if(thisMonth === "01" || thisMonth === "02" || thisMonth === "03"){
					startDate = "0101";
					endDate = "0331";
				}else if(thisMonth === "04" || thisMonth === "05" || thisMonth === "06"){
					startDate = "0401";
					endDate = "0630";
				}else if(thisMonth === "07" || thisMonth === "08" || thisMonth === "09"){
					startDate = "0701";
					endDate = "0930";
				}else if(thisMonth === "10" || thisMonth === "11" || thisMonth === "12"){
					startDate = "1001";
					endDate = "1231";
				}
				stdDateFrom = thisYear + startDate;
				stdDateTo = thisYear + endDate;
				break;
			case "Today"		:
				stdDateFrom = today;
				stdDateTo = today;
				break;
			case "Yesterday"		:
				stdDateFrom = xui.dateutil.getCalc(today, "d", -1, "");
				stdDateTo = xui.dateutil.getCalc(today, "d", -1, "");
				break;
			case "ThisWeek"	:
				stdDateFrom = xui.dateutil.getThisWeekBegin("yyyymmdd");
				stdDateTo =  xui.dateutil.getThisWeekEnd("yyyymmdd");
				break;
			case "ThisMonth"	:
				stdDateFrom = today.substring(0,6) + "01";
				stdDateTo = xui.dateutil.getLastDay(today, false);
				break;
			case "1Month"	:
				stdDateFrom = xui.dateutil.getCalc(today, "M", -1, "");
				stdDateTo = today
				break;
			case "2Months"	:
				stdDateFrom = xui.dateutil.getCalc(today, "M", -2, "");
				stdDateTo = today
				break;
			case "3Months"	:
				stdDateFrom = xui.dateutil.getCalc(today, "M", -3, "");
				stdDateTo = today
				break;
			case "6Months"	:
				stdDateFrom =xui.dateutil.getCalc(today, "M", -6, "");
				stdDateTo = today
				break;
			case "ThisYear"	:
				stdDateFrom =xui.dateutil.getCalc(today, "Y", -1, "");
				stdDateTo = today
				break;
			case "1Year"	:
				stdDateFrom = xui.dateutil.getCalc(today, "y", -1, "");
				stdDateTo = today
				break;
			case "ThisQuarter"	:
				var startDate = "";
				var endDate = "";
				if(thisMonth === "01" || thisMonth === "02" || thisMonth === "03"){
					startDate = "0101";
					endDate = "0331";
				}else if(thisMonth === "04" || thisMonth === "05" || thisMonth === "06"){
					startDate = "0401";
					endDate = "0630";
				}else if(thisMonth === "07" || thisMonth === "08" || thisMonth === "09"){
					startDate = "0701";
					endDate = "0930";
				}else if(thisMonth === "10" || thisMonth === "11" || thisMonth === "12"){
					startDate = "1001";
					endDate = "1231";
				}
				stdDateFrom = thisYear + startDate;
				stdDateTo = thisYear + endDate;
				break;
			default			:
				break;
		}
		if(isMonth){
			$("#" + dateFromId, formElement).valExt(stdDateFrom.substring(0,6));
			$("#" + dateToId, formElement).valExt(stdDateTo.substring(0,6));
		} else {
			$("#" + dateFromId, formElement).valExt(stdDateFrom);
			$("#" + dateToId, formElement).valExt(stdDateTo);
		}
	}

	/**
	 * 그리드 각 컬럼에 맞는 HTML 데이터로 변경합니다.
	 * @param	그리드 api 데이터
	 * @returns	{object} 변환된 html
	 */
	convertData(rowIdx, rowId, rowData, cellIdx, cellId){
		var returnValue = rowData[cellId];

		//VOC등급
		if(cellId === "vocGradeCode"){
			if(rowData.vocGradeCode === "H") {
				returnValue = "<span class='tag red5' data-tag-type='H' style='width:30px'>H</span>";
			} else if (rowData.vocGradeCode === "M"){
				returnValue = "<span class='tag orange4' data-tag-type='M' style='width:30px'>M</span>";
			}else if(rowData.vocGradeCode === "L"){
				returnValue = "<span class='tag blue5' data-tag-type='L' style='width:30px'>L</span>";
			}else{
				returnValue = "-";
			}
		}
		//VOC타입
		if(cellId === "vocTypeCode"){
			var classType = "gray4";
			var tagType = "";   // 변수명시
			if(rowData.vocTypeCode === "VOC"){
				classType = "orange4";
                tagType = 'VOC';
			} else if (rowData.vocTypeCode === "VOCC"){
				classType = "orange7";
                tagType = 'VOCC';
			} else if (rowData.vocTypeCode === "VOCO"){
				classType = "periBlue4";
                tagType = 'VOCO';
			} else if (rowData.vocTypeCode === "VOP"){
				classType = "purpleGray4";
                tagType = 'VOP';
			} else if (rowData.vocTypeCode === "VOM"){
				classType = "crimson4";
                tagType = 'VOM';
			}
			returnValue = "<span class='tag " + classType + "' data-tag-type='" + tagType + "'>" + rowData.vocTypeCode + "</span>";
		}
		//요약
		if(cellId === "vocSummary"){
			if(rowData.contentsStatusName === "S"){
				returnValue = "<i class='xfi xfi-ico_0324_ai_note' style='font-size:24px' xui-tooltip-title='"+rowData.vocSummary+"'></i>";
			} else {
				returnValue = "-";
			}
		}
		//핵심이슈
		if(cellId === "vocCustIssue"){
			if(rowData.contentsStatusName === "S"){
				returnValue = "<span xui-tooltip-title='" + rowData.vocCustIssue + "'>" + rowData.vocCustIssue + "</span>";
			} else {
				returnValue = "-";
			}
		}
		//리포트적용여부
		if(cellId === "reportAt"){
			if(rowData.reportAt === 'Y'){
				returnValue = "<div class='xfi xfi-ico_0016_confirm'></div>";
			}else{
				returnValue = "";
			}
		}
		//사용여부
		if(cellId === "useAt"){
			if(rowData.useAt === 'Y'){
				returnValue = "<div class='filey'></div>";
			}else{
				returnValue = "<div class='filen'></div>";
			}
		}
		//첨부파일
		if(cellId === "fileKeyCount"){
			if(rowData.fileKeyCount > 0){
				returnValue = "<div class='filey' xui-tooltip-title='file count(" + rowData.fileKeyCount + "cases)'></div>";
			}else{
				returnValue = "<div class='filen'></div>";
			}
		}
		//GBIS 원문
		if(cellId === "contentsLinkUrl"){
			//return "<i class='btn-i xfi xfi-ico_0058_link' id='btnLink' xui-tooltip-title='GBIS LINK'></i>";

			var regex = /href=['"]([^'"]+)['"]/i;
			var match = rowData.contentsLinkUrl.match(regex);
			if(match) {
				returnValue = "<i class='btn-i xfi xfi-ico_0058_link' onClick=\"window.open('" + match[1] + "', '_blank');\" xui-tooltip-title='GBIS LINK'></i>";
			}else{
				returnValue = "<i class='btn-i xfi xfi-ico_0058_link' xui-tooltip-title='GBIS LINK'></i>";
			}
		}
		//컨텐츠상태
		if(cellId === "contentsStatusName"){
			if(!xui.valid.isEmpty(rowData.contentsStatusName)){
				if(rowData.contentsStatusName === "S"){
					returnValue = "<span class='tagbtn gray6' title='Summary Contents'>S</span>";
				} else {
					returnValue = "<span class='tagbtn gray1' title='Original Contents'>-</span>";
				}
			}else{
				returnValue = "-";
			}
		}
		//고객명
		if(cellId === "custName"){
			if(!xui.valid.isEmpty(rowData.globalCustName)){
				returnValue = "<b xui-tooltip-title='" + rowData.globalCustName + "'>" + rowData.custName + "</b>";
			} else {
				returnValue = "<b xui-tooltip-title='" + rowData.custName + "'>" + rowData.custName + "</b>";
			}
		}
		//컨텐츠제목
		if(cellId === "contentsSubject"){
			returnValue = "<b style='cursor:pointer;' xui-tooltip-title='" + rowData.contentsSubject + "'>" + rowData.contentsSubject + "</b>";
		}
		//조회수
		if(cellId === "selectCount"){
			if(rowData.selectCount > 0){
				returnValue = "<span style='cursor:pointer;' xui-tooltip-title=''>" + rowData.selectCount + "</span>";
			}
		}
		//이력너수
		if(cellId === "historyCount"){
			if(rowData.historyCount > 0){
				returnValue = "<span class='tagbtn gray6 link' xui-tooltip-title=''>" + rowData.historyCount + "</span>";
			}
		}
		//리포트제목
		if(cellId === "reportSubject"){
			returnValue = "<b style='cursor:pointer;'  xui-tooltip-title='" + rowData.reportSubject + "'>" + rowData.reportSubject + "</b>";
		}
		//피드백
		if(cellId === "feedbackCount"){
			if(rowData.feedbackCount > 0){
				returnValue	= "<span class='tag periBlue6 link' xui-tooltip-title='피드백보기' data-tag-type='none'>" + rowData.feedbackCount + "</span>";
			}else{
				returnValue	= "<span class='tag purpleGray4 link' xui-tooltip-title='' data-tag-type='count'>" + rowData.feedbackCount + "</span>";
			}
		}
		//검색방법
		if(cellId === "searchMethod"){
			var className = "gray4";
			if(rowData.searchMethodCode === "010"){className = "periBlue4";}
			returnValue	= "<span class='tag " + className + "' xui-tooltip-title=''>" + rowData.searchMethod + "</span>";
		}
		//질문건수
		if(cellId === "questionCount"){
			returnValue	= "<span class='tagbtn periBlue6 link' xui-tooltip-title=''>" + rowData.questionCount + "</span>";
		}
		//질문건수
		if(cellId === "resultCount"){
			returnValue	= "<span class='tagbtn gray6 link' xui-tooltip-title=''>" + rowData.resultCount + "</span>";
		}

		//주간/월간 구분
		if(cellId === "reportSectionName"){
			if(rowData.reportSectionCode === "010"){
				returnValue	= "<span class='tag orange6' data-tag-type='weekly'>" + rowData.reportSectionName + "</span>";
			}else if(rowData.reportSectionCode === "020"){
				returnValue	= "<span class='tag periBlue6' data-tag-type='monthly'>" + rowData.reportSectionName + "</span>";
			}

		}

		//사용자 프롬프트 요청 처리 상태
		if(cellId === "processStatusName"){
			if(rowData.processStatusCode === "010"){
				returnValue	= "<span class='tag periBlue4'>" + rowData.processStatusName + "</span>";
			}else if(rowData.processStatusCode === "020"){
				returnValue	= "<span class='tag orange4'>" + rowData.processStatusName + "</span>";
			}else if(rowData.processStatusCode === "030"){
				returnValue	= "<span class='tag blue5'>" + rowData.processStatusName + "</span>";
			}else if(rowData.processStatusCode === "040"){
				returnValue	= "<span class='tag purpleGray4'>" + rowData.processStatusName + "</span>";
			}
		}

		//프롬프트 구분 코드
		if(cellId === "promptSectionName"){
			if(rowData.promptSectionCode === "010"){//단건 VOC 요약
				returnValue	= "<span class='tag orange6'>" + rowData.promptSectionName + "</span>";
			}else if(rowData.promptSectionCode === "020"){//정기리포트
				returnValue	= "<span class='tag periBlue6'>" + rowData.promptSectionName + "</span>";
			}else if(rowData.promptSectionCode === "030"){//VECTOR임베딩
				returnValue	= "<span class='tag blue5'>" + rowData.promptSectionName + "</span>";
			}else if(rowData.promptSectionCode === "040"){//RAG
				returnValue	= "<span class='tag purpleGray4'>" + rowData.promptSectionName + "</span>";
			}else if(rowData.promptSectionCode === "050"){//챗봇
				returnValue	= "<span class='tag purpleGray4'>" + rowData.promptSectionName + "</span>";
			}
		}
		//리포트 분석 여부
		if(cellId === "reportYn"){
			if(rowData.reportYn === 'Y'){
				returnValue = "<div class='filey'></div>";
			}else{
				returnValue = "";
			}
		}
		return returnValue;
	}

	/**
	 * VOC 상세 팝업 호출
	 * @param {string} contentsKey 컨텐츠키
	 * @returns	없음
	 */
	openVocPopup(contentsKey){
		// Validation
		if (xui.valid.isEmpty(contentsKey)) {
			xui.dialog.warning(vobCmmn.enum.NO_CONTENTS_KEY.getName(), vobCmmn.enum.NO_CONTENTS_KEY.getCode()); return;
		}

		var params = new xui.json();
		params.setString("contentsKey", contentsKey.trim());
		xui.com.openWindow("/webapps/xs/vob/pop/vocDetailPop.jsp", contentsKey.trim(), 840, 928, true, false, params, null, "2024120612211750241");
	}

	/**
	 * 대화내용 상세 팝업 호출
	 * @param {string} sessionKey 컨텐츠키
	 * @returns	없음
	 */
	openQuestionPopup(sessionKey, userId){
		// Validation
		if (xui.valid.isEmpty(sessionKey)) {
			xui.dialog.warning(vobCmmn.enum.NO_QUESTION_KEY.getName(), vobCmmn.enum.NO_QUESTION_KEY.getCode()); return;
		}

		var params = new xui.json();
		params.setString("sessionKey", sessionKey.trim());
		params.setString("userId", userId);
		xui.com.openWindow("/webapps/xs/vob/pop/questionDetailPop.jsp", sessionKey.trim(), 900, 700, true, false, params, null, "2024120612211750241");
	}

	/**
	 * 변경이력 팝업 호출
	 * @param {string} contentsKey 컨텐츠키
	 * @returns	없음
	 */
	openHistoryPopup(contentsKey){
		// Validation
		if (xui.valid.isEmpty(contentsKey)) {
			xui.dialog.warning(vobCmmn.enum.NO_CONTENTS_KEY.getName(), vobCmmn.enum.NO_CONTENTS_KEY.getCode()); return;
		}

		var params = new xui.json();
		params.setString("contentsKey", contentsKey);
		xui.com.openWindow("/webapps/xs/vob/pop/vocHistoryPop.jsp", "", 1680, 928, true, false, params, null);
	}

	makeTooltipEvent(className, objectValue, userParams) {
		var params = {width:"480px", height:"auto"};
		if(!xui.valid.isEmpty(userParams)){params = userParams;}
		if(xui.valid.isEmpty(objectValue)){objectValue = "$(this).html()";}
		$(className).hover(function(e) {
			$("body").append("<div id='tip'></div>");
			$("#tip")
                .css("position","absolute")
                .css("z-index",100)
                .css("width",params.width)
                .css("height",params.height)
                .css("padding","16px 20px")
                .css("border-radius", "16px")
                .css("background-color","white")
                .css("box-shadow","0 4px 48px 0 rgba(83, 84, 130, 0.4)")
                .css("box-sizing", "border-box")
                .css("font-size","14px")
                .css("color", "#333333")
                .css("line-height","22px")
                .css("word-break", "break-all");
			$("#tip").html(eval(objectValue));
			$("#tip").css({left : e.pageX + "px", top : e.pageY + "px"}).fadeIn(500);
		}, function() {
			$("#tip").remove();
		});
	}

    setAutoCombo(eventType){
		// 윈도우 스크롤 이동 시 레이어 팝업이 없을 경우 처리하지 않음
		// 윈도우 리사이즈의 경우 자체 event로 안보이게되므로 미처리
        if(eventType === "scroll"){
            // Combo Box 인 경우
            var comboBox = $(".xui-combo-container.on");
            if(comboBox.length > 0){
                // 조회영역의 기준이 되는 콤보 height값을 설정한다.
                var searchHeightLength = 28;
                // combo popup을 호출한 부모 element를 찾는다.
                var comboBoxParent = $(".xui-combo-label.on");
                // 부모창의 height가 공통(28 height 보다 큰 경우 )
                var comboBoxParentHeight = comboBoxParent.height() == searchHeightLength ? 0 : comboBoxParent.height() - searchHeightLength;
                // 부모element의 좌표를 산출한다.
                var comboBoxParentTop = comboBoxParent.offset().top + comboBoxParentHeight;
                var comboBoxParentPos = comboBoxParent.offset().left;
                // combo box의 popup의 위치를 조정한다.
                comboBox.css("top",comboBoxParentTop+searchHeightLength);
                comboBox.css("left",comboBoxParentPos);
                return;
            }

            // 달력인 경우 ( 일단위 )
            var calendarBox = $("input.xuiform_date:eq(0)");
            if(calendarBox.length != 0){
                if( xui.valid.isEmpty(calendarBox.api().getPicker().picker.activeElement) ){
                    calendarBox = $("input.xuiform_date:eq(1)");
                }
                if( xui.valid.isEmpty(calendarBox.api().getPicker().picker.activeElement) ){
                    calendarBox = $("input.xuiform_date:eq(2)");
                }
            }
            // 달력인 경우 ( 월단위 )
            if(calendarBox.length == 0){ calendarBox = $("input.xuiform_month:eq(0)");}
            // 달력인 경우 ( 년단위 )
            if(calendarBox.length == 0){ calendarBox = $("input.xuiform_year:eq(0)");}

            if(calendarBox.length > 0){
                if(xui.valid.isEmpty(calendarBox.api().getPicker().picker)){return;}
                // 달력을 선택한 부모 element를 찾는다.
                var calendarParentBox = $(calendarBox.api().getPicker().picker.activeElement);
                if(calendarParentBox.length===0){ return; }
                // 조회영역의 기준이 되는 콤보 height값을 설정한다.
                var searchHeightLength = 28;
                // 부모 element의 좌표를 산출한다.
                var calendarParentBoxTop = calendarParentBox.offset().top;
                var calendarParentBoxPos = calendarParentBox.offset().left;
                // calendar popup의 위치를 조정한다.
                var pickerBox            = $("div.dhx_popup.xui-picker-box");
                pickerBox.css("top",calendarParentBoxTop+searchHeightLength);
                pickerBox.css("left",calendarParentBoxPos);
                return;
            }
        }
    }

    // 20241213 모든 input element의 X버튼 클릭시 해당 엘리먼트의 마지막 자식 엘리먼트의 값을 초기화 한다.
    closeData(e){
        var targetElement = e.target;
        if( targetElement.classList.toString().indexOf("search") > -1
         || targetElement.classList.toString().indexOf("datepicker") > -1
         || targetElement.classList.toString().indexOf("doublepicker") > -1
          ){ return;}
        //if( e.target.classList.toString().indexOf("search") )
        e.target.lastElementChild.value = '';
		// (2025.03) 검수내용: 공통 조회조건 input 내 X 아이콘은 입력값이 있을 때만 보이도록 함
		e.target.classList.remove('notempty');
    }

    //자동완성 리스트 생성
    makeAutoSearchList (response) {
		var contentsData = response.getDataJsonArray("DATA_CONTENTS");
		var questionData = response.getDataJsonArray("DATA_QUESTION");
		var keywordData = response.getDataJsonArray("DATA_KEYWORD");
		var searchKeywordDivHTML = "";
		$('.item-list').remove();

		if(xui.valid.isEmptyJsonArray(contentsData) && xui.valid.isEmptyJsonArray(keywordData)&& xui.valid.isEmptyJsonArray(questionData)){

			searchKeywordDivHTML += '<div class="item-list">'
								+		'<div class="title --empty">' + xui.message.get("aisearch010.NO_RECOMMENDED") + '</div>'
								+ 	'</div>';
		}
		if(!xui.valid.isEmptyJsonArray(contentsData)){
			var contentsLength = contentsData.length;
			if(contentsLength > 5){contentsLength = 5;}
			searchKeywordDivHTML += '<div class="item-list">';
			searchKeywordDivHTML += '<div class="title">' + xui.message.get("vocSearchResults") +'</div>';
			for(var i=0;i<contentsLength;i++){
				searchKeywordDivHTML += '<div class="item">';
				searchKeywordDivHTML += '<div class="doc"></div>';
				contentsData[i].contentsSubject = xui.util.restoreXSS(contentsData[i].contentsSubject);
				searchKeywordDivHTML += '<div class="text voc-autobox"'+' data-id=' + contentsData[i].contentsKey+'>'+contentsData[i].contentsSubject+'</div>';
				searchKeywordDivHTML += '</div>';
			}
			searchKeywordDivHTML += '</div>';
		}
		if(!xui.valid.isEmptyJsonArray(questionData)){
			var questionLength = questionData.length;
			if(questionLength > 5){questionLength = 5;}
			searchKeywordDivHTML += '<div class="item-list">';
			searchKeywordDivHTML += '<div class="title">' + xui.message.get("querySearchResults") + '</div>';
			for(var i=0;i<questionLength;i++){
				searchKeywordDivHTML += '<div class="item">';
				searchKeywordDivHTML += '<div class="chat"></div>';
				questionData[i].keywordName = xui.util.restoreXSS(questionData[i].keywordName);
				searchKeywordDivHTML += '<div class="text voc-query">'+questionData[i].keywordName+'</div>';
				searchKeywordDivHTML += '</div>';
			}
			searchKeywordDivHTML += '</div>';
		}
		if(!xui.valid.isEmptyJsonArray(keywordData)){
			searchKeywordDivHTML += '<div class="item-list">';
			searchKeywordDivHTML += '<div class="title">' + xui.message.get("keyKeyword") + '</div>';
			searchKeywordDivHTML += '<div class="words">';
			keywordData.forEach(keywordRow => {
				keywordRow.keywordName = xui.util.restoreXSS(keywordRow.keywordName);
				searchKeywordDivHTML  += '<div class="voc-word">'+keywordRow.keywordName+'</div>';
			});
			searchKeywordDivHTML += '</div>';
			searchKeywordDivHTML += '</div>';
		}
		$(".auto-box").html(searchKeywordDivHTML);
	}

    //검색어 1차 정제 (한글, 영문, 숫자, 공백, 베트남어, 중국어, 일본어 이외의 문자 삭제)
	parseWord (keyword) {
		// 한글, 영문, 숫자, 공백, 베트남어, 중국어, 일본어만 허용
		return keyword.replace(/[^a-zA-Zㄱ-ㅎ가-힣0-9\s\u00C0-\u024F\u1E00-\u1EFF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF~`!@#$%^&*()\_\-+=\[\]{}\\|:;"'<>,.\/?]/g, "").trim();
	}

	validOnlyOperator(keyword) {
		var tempKeyword = keyword.replace(new RegExp("[\\&\\^\\s+]", 'g'), "").trim();
		if (tempKeyword.length <= 0) {
			$("keyword").valExt(tempKeyword);
			return false;
		}
		return true;
	}

	validEndOperator(keyword) {
		//var regex = new RegExp("\\&$|\\^$");
		var regex = new RegExp("^[\\&\\^]|[\\&\\^]$");
		if (regex.test(keyword)) return false;
		return true;
	}


	//통합검색 시 Validation
	validationSearch (isform, searchkeywordId, keyword, type, searchMethod) {
		if(xui.valid.isEmpty(type)){type = "search";}
		//searchMethod 검색방법 020:단어검색
		if(xui.valid.isEmpty(searchMethod)){searchMethod = "020";}

		//프레임웍에서 지원하는 기본 유효성 체크
		if(isform){	if(!xui.valid.check("searchForm")){return false;}}

		//앞뒤공백제거
		keyword = keyword.trim();

		if(searchMethod==='020' && type ==='search'){
			// (한글, 영문, 숫자, 공백, 베트남어, 중국어, 일본어 이외의 문자 삭제)
			keyword = vobCmmn.parseWord(keyword);

			// 검색어가 빈 경우 (메시지 분리하여 띄움)
            if(xui.valid.isEmpty(keyword)){
				xui.dialog.warning(xui.message.get("dashboard010.NO_KEYWORD"), "WARNING");
				return false;
            }
			// 검색어에 연산기호만 있는 경우
			if (!vobCmmn.validOnlyOperator(keyword)) {
				xui.dialog.warning(xui.message.get("searchOnlyOperator"), "WARNING");
				return false;
			}
			// 검색어가 연산기호로 시작하거나 끝나는 경우
			if (!vobCmmn.validEndOperator(keyword)) {
				xui.dialog.warning(xui.message.get("searchEndOperator"), "WARNING");
				return false;
			}
		}

		// 검색어 영역에 특수문자를 제거한 후 검색이 될 수 있도록 검색어세팅
		$("#" + searchkeywordId).val(keyword);

		// 검색어가 빈 경우
		if (xui.valid.isEmpty(keyword)) {
			xui.dialog.warning(vobCmmn.enum.NO_KEYWORD.getName(), vobCmmn.enum.NO_KEYWORD.getCode());
			return false;
		}

		// 검색어가 한글자인 경우
		if (keyword.trim().length ==1) {
			xui.dialog.warning(vobCmmn.enum.NO_KEYWORD_LENGTH.getName(), vobCmmn.enum.NO_KEYWORD_LENGTH.getCode());
			return false;
		}

		return true;
	}

	//자동완성시 Validation
	validationAutoSearch (keyword) {
		var reg = new RegExp("[^a-zA-Z0-9\uAC00-\uD7A3\\s\u00C0-\u024F\u1E00-\u1EFF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF~`!@#$%^&*()_\\-+=\\[\\]{}\\\\|:;\"'<>,./?]+");
		if (xui.valid.isEmpty(keyword) || reg.test(keyword)) return false;
		return true;
	}

	//자동완성시 keywordReplace
	replaceAutoWordKeyword (keyword) {
		keyword =  keyword.replace(/^[&^]+|[&^]+$/g, ' ').trim();
		return keyword;
	}


	//챗봇 검색 커서 제일 뒤로 이동
	moveCursorEnd () {
		var range = document.createRange();
		var sel = window.getSelection();
		range.selectNodeContents($("#sendText").get(0));
		range.collapse(false);
		sel.removeAllRanges();
		sel.addRange(range);
	}

	//챗봇 입력 영역에 복사한 텍스트를 붙여넣기합니다.
	setPasteText(event){
		// 기본 붙여넣기 동작 방지
		event.preventDefault();
		// 클립보드에서 텍스트만 가져오기
		var text = event.originalEvent.clipboardData.getData("text/plain");
		// 현재 커서 위치에 텍스트 삽입
		var selection = window.getSelection();
		if (!selection.rangeCount) return;

		var range = selection.getRangeAt(0);
		range.deleteContents();
		// 삽입할 텍스트 노드를 삽입
		var textNode = document.createTextNode(text);
		range.insertNode(textNode);

		// 커서 위치를 텍스트 끝으로 이동시킴
		range.setStartAfter(textNode);
		range.setEndAfter(textNode);

		// 커서 위치를 업데이트
		selection.removeAllRanges();
		selection.addRange(range);
	}

    //검색도움말 토글
   	toggleSearchHelp (e, helpId) {
   		var helpDiv = document.getElementById(helpId);

   		// 클릭된 요소의 위치 정보 얻기
   		var targetDiv = e.currentTarget;
   		var rect = targetDiv.getBoundingClientRect();
   		// 팝업 div의 위치 설정
   		helpDiv.style.left = (rect.left -250) + "px";
   		helpDiv.style.top = (rect.bottom + window.scrollY +23) + "px"; // 클릭한 요소의 아래에 위치시키기
   		$("#" + helpId).removeClass("xui-invisible");

   		document.addEventListener("click", function(e) {
   			var helpDiv = document.getElementById(helpId);
   			// 클릭한 곳이 팝업 div나 클릭 가능한 div가 아닌 경우 팝업 숨기기
   			if (!helpDiv.contains(e.target) && e.target.id !== "searchHelp") {
   				$("#" + helpId).addClass("xui-invisible");
   			}
   		});
   	}

    //검색도움말 토글
   	loadingProc (id) {
   		var animationData = {"v":"5.6.5","fr":29.9700012207031,"ip":0,"op":45.0000018328876,"w":20,"h":20,"nm":"chat_loading","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"Layer 1 Outlines","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":45.0000018328876,"s":[360]}],"ix":10},"p":{"a":0,"k":[10,10,0],"ix":2},"a":{"a":0,"k":[10,10,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[-1.316,0.879],[-0.605,1.462],[0.309,1.552],[1.119,1.119],[1.552,0.308],[1.462,-0.606],[0.879,-1.315],[0,-1.582]],"o":[[1.582,0],[1.315,-0.879],[0.606,-1.461],[-0.308,-1.552],[-1.119,-1.119],[-1.552,-0.309],[-1.461,0.605],[-0.879,1.316],[0,0]],"v":[[-0.077,8.077],[4.367,6.73],[7.314,3.139],[7.768,-1.484],[5.579,-5.579],[1.484,-7.768],[-3.139,-7.313],[-6.73,-4.367],[-8.077,0.077]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":6,"s":[0.501960784314,0.501960784314,0.501960784314,1]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":21,"s":[0.305882364511,0.537254929543,0.992156863213,1]},{"t":38.0000015477717,"s":[0.501960784314,0.501960784314,0.501960784314,1]}],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[10,10],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":45.0000018328876,"st":0,"bm":0}],"markers":[]};
		var params = {
		  container: document.getElementById(id),
		  renderer: "svg",
		  loop: true,
		  autoplay: true,
		  animationData: animationData,
		};

		var anim = lottie.loadAnimation(params);
   	}

    /**
	 * 프롬프트변경이력 팝업 호출
	 * @param {object} rowData 프롬프트정보
	 * @returns	없음
	 */
	openPromptHistory(rowData){
		//구분별 Validation 체크
		if (xui.valid.isEmpty(rowData.promptKey)) {
			var message = vobCmmn.enum.EMPTY_PROMPT_KEY.getName();
			var title = vobCmmn.enum.EMPTY_PROMPT_KEY.getCode();
			xui.dialog.warning(message, title); return;
		}
		var params = new xui.json();
		params.setDataJsonObject(rowData);
		xui.com.openWindow("/webapps/xs/vob/management/prompt/prompt021.jsp", rowData.promptKey, 1680, 928, true, false, params, function(retParams){});
	}
};

var vobCmmn	= new _vobCmmn();
_vobCmmn	= null;

$(window).ready(function () {
	//조회 조건 접기 기능 통합 적용
    //$(window).resize(function() {vobCmmn.setAutoCombo("resize");});
    $(".document-body").scroll(function() {vobCmmn.setAutoCombo("scroll");});
    $(".xui-input-label").click(function(e){vobCmmn.closeData(e);});
	// (2025.03) 검수내용: 공통 조회조건 input 내 X 아이콘은 입력값이 있을 때만 보이도록 함
	document.addEventListener('input', function (e) {
		if (e.target.tagName === 'INPUT') {
			if (e.target.value.trim() !== '') {
				e.target.parentElement.classList.add('notempty'); // 입력 값이 있으면 notempty 클래스 추가
			} else {
				e.target.parentElement.classList.remove('notempty'); // 입력 값이 없으면 notempty 클래스 제거
			}
		}
	});
});