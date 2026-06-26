<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="chat-info">
    <div class="chat-info-message" message-text="hyobee.notice.ai_may_be_inaccurate"></div>
    <div class="chat-info-group">
        <div id="how_to_use" class="chat-info-message" message-text="hyobee.help.cta"></div>
        <div id="howToUseModal" class="modal">
            <div class="modal-content">
                <div class="tooltip-header">
                    <b class="header-cubee" message-text="hyobee.help.title"></b>
                    <div class="header-div" message-text="hyobee.help.description"></div>
                    <img class="divider-icon" alt="">
                </div>
                <div class="tooltip-list-view">
                    <b class="list-b" message-text="hyobee.toggle.internal_search"></b>
                    <div class="description">
                        <div class="tooltip-div">
                            <p class="tooltip-p" message-text="hyobee.help.internal.description"></p>
                            <p class="tooltip-p">
                                <span message-text="hyobee.help.internal.user_prefix"></span>
                                <b class="tooltip-b" id='tooltip-name'></b>
                                <span class="tooltip-b" message-text="hyobee.help.internal.user_suffix"></span>
                            </p>
                        </div>
                        <div class="frame-parent" id="boardsAuth">
                            <div class="wrapper">
                                <div class="tooltip-div" message-text="hyobee.help.internal.board_sample_1"></div>
                            </div>
                            <div class="wrapper">
                                <div class="tooltip-div" message-text="hyobee.help.internal.board_sample_2"></div>
                            </div>
                            <div class="wrapper">
                                <div class="tooltip-div" message-text="hyobee.help.internal.board_sample_3"></div>
                            </div>
                        </div>
                        <div class="tooltip-div">
                            <p class="tooltip-p" message-text="hyobee.help.internal.tip_1"></p>
                            <p class="tooltip-p" message-text="hyobee.help.internal.tip_2"></p>
                        </div>
                    </div>
                    <img class="divider-icon" alt="">
                </div>
                <div class="tooltip-list-view">
                    <b class="list-b" message-text="hyobee.toggle.journal_search"></b>
                    <div class="description">
                        <div class="tooltip-div">
                            <p class="tooltip-p" message-text="hyobee.help.journal.description" style="margin-bottom: 20px;"></p>
                        </div>
                        <div class="tooltip-div">
                            <p class="tooltip-p" message-text="hyobee.help.journal.tip_1"></p>
                            <p class="tooltip-p" message-text="hyobee.help.journal.tip_2"></p>
                            <p class="tooltip-p" message-text="hyobee.help.journal.tip_2"></p>
                        </div>
                    </div>
                    <img class="divider-icon" alt="">
                </div>
                <div class="tooltip-list-view">
                    <b class="list-b" message-text="hyobee.toggle.web_search"></b>
                    <img class="divider-icon2" alt="">
                    <div class="tooltip-description">
                        <div class="tooltip-div">
                            <p class="tooltip-p" message-text="hyobee.help.web.description_1"></p>
                            <p class="tooltip-p" message-text="hyobee.help.web.description_2"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <i class="current-type-message --corp">사내검색을 시작합니다. (GPT 5.1)</i>
    <i class="current-type-message --web">웹검색을 시작합니다. (GPT 4.1)</i>
    <i class="current-type-message --journal">저널 검색을 시작합니다. (GPT 5.1)</i>
    <i class="current-type-message --corp-ing">사내검색중입니다. (GPT 5.1)</i>
    <i class="current-type-message --web-ing">웹검색중입니다. (GPT 4.1)</i>
    <i class="current-type-message --journal-ing">저널 검색중입니다. (GPT 5.1)</i>
</div>
<div class="banner-message" message-text="hyobee.copy.success"></div>
<!-- [S] 260529 : 추천 저널 설정 -->
<div class="common-dialog">
    <div class="common-dialog__document">
        <div class="common-dialog__head">
            <p class="common-dialog__heading" message-text="hyobee.menu.recommend_journal_settings"></p>
            <div class="common-dialog__close"
                 tabIndex="0"
            ></div>
        </div>
        <div class="common-dialog__body">
            <div class="common-dialog__content">
                <p class="common-dialog__title" message-text="hyobee.dialog.recommend_journal_settings"></p>
                <div class="common-dialog__selection" data-selected-team-code="">
                    <span class="common-dialog__select-text">팀</span>
                    <div class="common-dialog__select"></div>
                </div>
            </div>
            <div class="common-dialog__buttons">
                <div class="common-dialog__confirm" tabIndex="0" message-text="save">저장</div>
            </div>
        </div>
    </div>
</div>
<!-- [E] 260529 : 추천 저널 설정 -->
