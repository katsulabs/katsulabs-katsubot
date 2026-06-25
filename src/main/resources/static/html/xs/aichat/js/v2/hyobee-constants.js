/***************************************************************************************************************************************************************
 * @classDescription Hyobee 채팅 화면 공통 상수 (TB-004 Phase 1)
 * @author HyosungITX Corp.
 ****************************************************************************************************************************************************************/
"use strict";

(function (global) {
    global.HyobeeConstants = {
        MAX_LENGTH: 20480,
        mintTargetSize: 30,
        mintMinScore: 0.4,
        host: {
            dev: "ai-chatdev.hyosung.com",
            prod: "ai-chat.hyosung.com"
        },
        JOURNAL_SIMILARITY: {
            KEYWORD_THRESHOLD: 0.4,
            LOW_VALUE: -999,
            KEYWORD_TAG_KEY: "hyobee.chat.journal.source.tab.tag.keyword",
            LOW_TAG_KEY: "hyobee.chat.journal.source.tab.tag.reference"
        },
        JOURNAL_ALLOWED_PU_CODES: ["H01"],
        JOURNAL_ALLOWED_CORP_CODES: ["00"],
        JOURNAL_ALLOWED_TEAM_CODES: [
            "74C05", "64Y00", "74W22", "65R00", "65B00", "18Y00", "13400", "65Q00", "74C22",
            "65H00", "74R68", "74P94", "74V96", "65K00", "74E14", "74Q39", "74G40", "74B79", "75S04"
        ],
        FILE_VALIDATION: {
            MAX_COUNT: 3,
            MAX_SIZE: 20 * 1024 * 1024,
            ALLOWED_EXTENSIONS: [
                ".jpg", ".jpeg", ".png", ".gif", ".bmp",
                ".doc", ".docx", ".hwp", ".hwpx", ".pdf",
                ".xls", ".xlsx",
                ".ppt", ".pptx",
                ".txt"
            ],
            ALLOWED_TYPES: [
                "image/jpeg", "image/png", "image/gif", "image/bmp",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/x-hwp", "application/haansofthwp", "application/vnd.hancom.hwp", "application/hwp",
                "application/x-hwpml", "application/vnd.hancom.hwpx",
                "application/pdf",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "text/plain"
            ]
        }
    };
})(window);
