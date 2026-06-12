-- ========================================
-- 파일 로그 테이블 (chat_api_file_log)
-- ========================================

CREATE TABLE IF NOT EXISTS chat_api_file_log
(
    company_code  VARCHAR(50)               NOT NULL,
    log_key       VARCHAR(50)               NOT NULL,
    file_log_key  VARCHAR(50)               NOT NULL,
    file_name     VARCHAR(500),
    file_size     BIGINT,
    file_type     VARCHAR(100),
    mime_type     VARCHAR(100),
    success_yn    CHAR(1)     DEFAULT 'N'   NOT NULL,
    error_message TEXT,
    create_dt     TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT pk_chat_api_file_log PRIMARY KEY (company_code, file_log_key)
);

-- 테이블 코멘트
COMMENT ON TABLE chat_api_file_log IS '외부 API 송수신 로그 파일 정보 (AI Chat)';

-- 컬럼 코멘트
COMMENT ON COLUMN chat_api_file_log.company_code IS '회사코드';
COMMENT ON COLUMN chat_api_file_log.log_key IS '로그 그룹 고유키 (chat_api_log.log_key 참조)';
COMMENT ON COLUMN chat_api_file_log.file_log_key IS '로그 고유키 (PK)';
COMMENT ON COLUMN chat_api_file_log.file_name IS '파일명';
COMMENT ON COLUMN chat_api_file_log.file_size IS '파일 크기(Bytes)';
COMMENT ON COLUMN chat_api_file_log.file_type IS '파일 확장자 (예: pdf, png, jpg 등)';
COMMENT ON COLUMN chat_api_file_log.mime_type IS '파일 MIME 타입 (예: application/pdf, image/png 등)';
COMMENT ON COLUMN chat_api_file_log.success_yn IS '파일 저장 성공 여부 (Y: 성공, N: 실패)';
COMMENT ON COLUMN chat_api_file_log.error_message IS '에러 메시지';
COMMENT ON COLUMN chat_api_file_log.create_dt IS '생성 일시';

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chat_api_file_log_fk
    ON chat_api_file_log (log_key);
COMMENT ON INDEX idx_chat_api_file_log_fk IS 'FK 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_file_log_01
    ON chat_api_file_log (company_code, log_key, file_log_key);
COMMENT ON INDEX idx_chat_api_file_log_01 IS '로그별 파일 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_file_log_02
    ON chat_api_file_log (company_code, file_name)
    WHERE file_name IS NOT NULL;
COMMENT ON INDEX idx_chat_api_file_log_02 IS '파일명 검색용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_file_log_03
    ON chat_api_file_log (company_code, file_type)
    WHERE file_type IS NOT NULL;
COMMENT ON INDEX idx_chat_api_file_log_03 IS '파일 타입별 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_file_log_04
    ON chat_api_file_log (company_code, create_dt DESC);
COMMENT ON INDEX idx_chat_api_file_log_04 IS '생성일시별 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_file_log_05
    ON chat_api_file_log (log_key, create_dt DESC);
COMMENT ON INDEX idx_chat_api_file_log_05 IS '로그별 최신 파일 조회용 인덱스';

-- 제약조건 코멘트
COMMENT ON CONSTRAINT pk_chat_api_file_log ON chat_api_file_log IS '회사코드, file_log_key';

