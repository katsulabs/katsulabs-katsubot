<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- 좌측 영역: 헤더, 대화 이력, 새 대화/삭제 버튼, 사용자 정보 --%>
<!-- [S] 좌측 영역 -->
<div class="left-unfolded">
    <div class="window-popup-header">
        <div class="btn aside-button" tabIndex="0">
            <i class="aside-button-stick"></i>
            <i class="aside-button-stick"></i>
            <i class="aside-button-stick"></i>
        </div>
        <b class="ask-cubee">Ask Hyobee</b>
        <form action="#" id="searchForm" class="--offscreen">
            <input type="hidden" class="required" id="user_id" name="user_id" value="" style="width: 50px;"/>
            <input type="hidden" class="required" id="pg_code" name="pg_code" value="" style="width: 50px;"/>
            <input type="hidden" class="required" id="pu_code" name="pu_code" value="" style="width: 50px;"/>
            <input type="hidden" class="required" id="team_code" name="team_code" value="" style="width: 50px;"/>
            <input type="hidden" class="required" id="corp_code" name="corp_code" value="" style="width: 50px;"/>
            <input type="hidden" class="required" id="user_full_name" name="user_full_name" value="" style="width: 50px;"/>
            <input type="hidden" class="required" id="user_first_name" name="user_first_name" value="" style="width: 50px;"/>
        </form>
    </div>
    <div class="bottom">
        <!-- [D] 비활성 상태의 경우: .--disabled 추가  //-->
        <div class="window-popup-btn common-focusable-state" id="btn-write" tabIndex="0">
            <i class="xfi xfi-ico_0018_edit" id="edit" aria-hidden="true"></i>
            <div class="in-txt" message-text="hyobee.action.new_conversation"></div>
        </div>
        <div class="window-popup-btn common-focusable-state chat-history" id="" tabIndex="0">
            <i class="xfi xfi-ico_0340_delete_history" id="" aria-hidden="true"></i>
            <i class="xfi xfi-ico_0175_arrow_prev" id="" aria-hidden="true"></i>
            <div class="in-txt" message-text="hyobee.action.delete_conversations"></div>
        </div>
        <!-- [S][기술원] 버튼 추가 -->
        <div class="window-popup-btn common-focusable-state" id="btn-journal" tabIndex="0">
            <i class="xfi xfi-ico_0160_article" aria-hidden="true"></i>
            <div class="in-txt" message-text="hyobee.menu.journal"></div>
        </div>
        <div class="window-popup-btn common-focusable-state xui-invisible" id="" tabIndex="0">
            <i class="xfi xfi-ico_0325_sparkle" id="edit" aria-hidden="true"></i>
            <div class="in-txt" message-text="hyobee.menu.report"></div>
        </div>
        <!-- [S] 대화 이력이 있는 경우 -->
        <!-- [D] 삭제 상태의 경우: .--delete 추가 //-->
        <div class="current navigation">
            <div class="sub-title">
                <div class="div">
                    <input type="checkbox" id="checkbox-all" class="navigation-item-checkbox" />
                    <label for="checkbox-all" class="navigation-item-label"></label>
                    <span message-text="hyobee.menu.recent_conversations"></span>
                </div>
                <div class="chat-delete common-focusable" tabIndex="-1">
                    <i class="xfi xfi-ico_0042_delete" id="btn-delete" aria-hidden="true"></i>
                </div>
                <div class="folder-button common-focusable">
                    <i class="xfi xfi-ico_0002_arrow_down_line_nor" id="" aria-hidden="true"></i>
                </div>
            </div>
            <div class="list-view xui-invisible navigation-list" id="chatHistory">
                <!-- [D] 선택된 경우 .on 추가 //-->
                <div class="list-view2-item">
                    <input type="checkbox" id="checkbox-0" title="대화 삭제" class="navigation-item-checkbox" />
                    <label for="checkbox-0" class="navigation-item-label"></label>
                    <div class="list-view2 on">
                        <div class="text-area">이번 분기 연차 사용 기한</div>
                    </div>
                </div>
                <div class="list-view2-item">
                    <input type="checkbox" id="checkbox-1" title="대화 삭제" class="navigation-item-checkbox" />
                    <label for="checkbox-1" class="navigation-item-label"></label>
                    <div class="list-view2">
                        <div class="text-area">이번 분기 연차 사용 기한</div>
                    </div>
                </div>
                <!-- [S] 더보기 -->
                <div class="list-view2-item more-button" tabIndex="0" message-text="hyobee.conversations.more"></div>
                <!-- [E]  더보기 -->
            </div>
        </div>
        <!-- [E] 대화 이력이 있는 경우 -->
        <!-- [S] 대화 이력이 없는 경우 -->
        <div class="empty" id="noChatHistory" message-text="hyobee.conversation.empty"></div>
        <!-- [E] 대화 이력이 없는 경우 -->
    </div>
    <!-- [S] 관리자 진입 구좌 -->
    <div class="current-user">
        <div class="current-user__content">
            <div class="current-user__key">
                <p class="current-user__name"></p>
                <p class="current-user__position"></p>
            </div>
            <div class="current-user__value">
                <p class="current-user__affiliate"></p>
            </div>
        </div>
        <div class="current-user__utility">
            <!-- [S] 260529 : 추천 저널 설정 -->
            <div
                class="current-user__setting common-focusable" tabIndex="0"
            ></div>
            <div class="current-user__dropdown">
                <div class="current-user__menu-list">
                    <div class="current-user__menu-item lang">
                        <div class="current-user__menu-text" message-text="hyobee.menu.language_settings"></div>
                        <div class="current-user__language">
                            <div class="current-user__language-text" message-text="hyobee.locale.ko">한국어</div>
                            <div class="current-user__language-list">
                                <div class="current-user__language-item" data-language-code="ko" message-text="hyobee.locale.ko">한국어</div>
                                <div class="current-user__language-item" data-language-code="en" message-text="hyobee.locale.en">English</div>
                                <div class="current-user__language-item" data-language-code="zh" message-text="hyobee.locale.zh">中國語</div>
                            </div>
                        </div>
                    </div>
                    <div class="current-user__menu-item user xui-invisible">
                        <div class="current-user__menu-text" message-text="hyobee.menu.personalization_settings">개인화 설정</div>
                    </div>
                    <div class="current-user__menu-item reco xui-invisible" tabIndex="0">
                        <div class="current-user__menu-text" message-text="hyobee.menu.recommend_journal_settings"></div>
                    </div>
                    <div class="current-user__menu-item feed xui-invisible">
                        <div class="current-user__menu-text" message-text="hyobee.menu.feedback_and_error_report">피드백 및 오류 신고</div>
                    </div>
                    <div class="current-user__menu-item admin xui-invisible">
                        <div class="current-user__menu-text" message-text="hyobee.menu.admin_access">관리자 화면 접속</div>
                    </div>
                </div>
                <!-- [E] 260529 : 추천 저널 설정 -->
            </div>
        </div>
    </div>
    <!-- [E] 관리자 진입 구좌 -->
    <!-- [S] 시스템 관리자 UI 추가 -->
    <div class="owner xui-invisible">
        <div class="xui-box">
            <form>
                <div class="row">
                    <div class="cell xui-invisible">
                        <label class="xui-combo-label">
                            <input type="text" class="input" id="viewable_team_code" name="viewable_team_code" readonly />
                        </label>
                        <button type="button" class="xui-button sub allowed" id="btnLogout" message-text="xui.BUTTON_LOGOUT" authType="N">로그아웃</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- [E] 시스템 관리자 UI 추가 -->
</div>
<!-- [E] 좌측 영역 -->
