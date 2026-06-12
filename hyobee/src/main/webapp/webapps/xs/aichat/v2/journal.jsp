<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="journal-dashboard">
    <div class="document-body">
        <div class="xui-doc-wrapper">
            <div class="contents-container">
                <div class="xui-box searchbox">
                    <div class="xui-box-head">
                        <div class="xui-title">
                            <p message-text="hyobee.journal.grid.status.collected"></p>
                        </div>
                        <div class="xui-actions">
                            <button type="button" class="xui-button large" id="btnSearch" authType="N" message-text="hyobee.journal.grid.action.search"></button>
                            <button type="button" class="xui-button base" id="btnReset" authType="N" message-text="hyobee.journal.grid.action.clear"></button>
                            <button type="button" class="xui-button base" id="btnExcel"	authType="N" message-text="hyobee.journal.grid.action.excel_download"></button>
                        </div>
                    </div>
                    <div class="xui-box-body">
                        <form action="#" id="searchForm">
                            <div class="row">
                                <div class="cell s5">
                                    <span class="th" message-text="hyobee.journal.grid.filter.date_range"></span>
                                    <label class="xui-input-label doublepicker">
                                        <input type="text" class="xuiform_date picker from"
                                               id="requestDateFrom" name="requestDateFrom"
                                               message-tooltip="startDate" xui-tooltip-title="시작일"
                                               placeholder="FROM" link="requestDateTo"
                                               autocomplete="off" maxlength="10">
                                    </label>
                                    <p class="interval"></p>
                                    <label class="xui-input-label doublepicker">
                                        <input type="text" class="xuiform_date picker to"
                                               id="requestDateTo" name="requestDateTo"
                                               message-tooltip="endDate" xui-tooltip-title="종료일"
                                               placeholder="TO" link="requestDateFrom"
                                               autocomplete="off" maxlength="10">
                                    </label>
                                    <div class="setDate">
                                        <span data-id="1y" message-text="hyobee.journal.grid.filter.date_range.last_1y"></span>
                                        <span data-id="3y" message-text="hyobee.journal.grid.filter.date_range.last_3y"></span>
                                        <span data-id="5y" message-text="hyobee.journal.grid.filter.date_range.last_5y"></span>
                                    </div>
                                </div>
                                <div class="cell s3">
                                    <span class="th" message-text="hyobee.journal.grid.filter.category.lbl"></span>
                                    <div class="form-group">
                                        <label class="xui-checkbox-label checked">
                                            <input type="checkbox" checked data-id="paper">
                                            <span message-text="hyobee.journal.type.paper"></span>
                                        </label>
                                        <label class="xui-checkbox-label checked">
                                            <input type="checkbox" checked data-id="patent">
                                            <span message-text="hyobee.journal.type.patent"></span>
                                        </label>
                                        <label class="xui-checkbox-label checked">
                                            <input type="checkbox" checked data-id="article">
                                            <span message-text="hyobee.journal.type.article"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="cell s4">
                                    <span class="th" message-text="hyobee.journal.grid.filter.identifier.lbl"></span>
                                    <label class="xui-input-label">
                                        <input type="text" class="lang"
                                               id="source_url"
                                               message-placeholder="hyobee.journal.grid.filter.identifier.ph" autocomplete="off">
                                    </label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="cell s3">
                                    <span class="th" message-text="hyobee.journal.grid.filter.collection_no.lbl"></span>
                                    <label class="xui-input-label">
                                        <input type="text" class="lang"
                                               id="journal_id"
                                               message-placeholder="hyobee.journal.grid.filter.collection_no.ph" autocomplete="off">
                                    </label>
                                </div>
                                <div class="cell s5">
                                    <span class="th long" message-text="hyobee.journal.grid.filter.keyword.lbl"></span>
                                    <label class="xui-input-label">
                                        <input type="text" class="lang"
                                               id="keyword"
                                               message-placeholder="hyobee.journal.grid.filter.keyword.ph" autocomplete="off">
                                    </label>
                                </div>
                                <div class="cell s4">
                                    <span class="th" message-text="hyobee.journal.grid.filter.author.lbl"></span>
                                    <label class="xui-input-label">
                                        <input type="text" class="lang"
                                               id="creator"
                                               message-placeholder="hyobee.journal.grid.filter.author.ph" autocomplete="off">
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="xui-doc-wrapper-row">
                    <div class="xui-container">
                        <div class="xui-box gridbox">
                            <div class="xui-box-head">
                                <div class="xui-title">
                                    <p message-text="hyobee.journal.grid.title"></p>
                                </div>
                            </div>
                            <div class="xui-box-body h-auto">
                                <div class="xui-grid-container">
                                    <!-- min-height 제거: 화면 높이에 맞춰 유동적으로 표시 -->
                                    <div id="divGrid01" style="min-height: 440px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

