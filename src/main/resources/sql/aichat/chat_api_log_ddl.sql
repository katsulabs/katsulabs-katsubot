-- ========================================
-- 메인 로그 테이블 (chat_api_log) - 월별 파티셔닝
-- ========================================

CREATE TABLE IF NOT EXISTS chat_api_log
(
    company_code         VARCHAR(50)               NOT NULL,
    log_key              VARCHAR(50)               NOT NULL,
    vendor               VARCHAR(50),
    api_path             VARCHAR(200),
    api_base_url         VARCHAR(500),
    api_full_url         VARCHAR(2000),
    http_method          VARCHAR(10),
    request_dt           TIMESTAMPTZ               NOT NULL,
    request_header       JSONB,
    request_query_string TEXT,
    request_body         JSONB,
    response_dt          TIMESTAMPTZ,
    response_status_code VARCHAR(10),
    response_header      JSONB,
    response_body        JSONB,
    response_body_size   BIGINT,
    response_time_ms     BIGINT,
    call_status          VARCHAR(20),
    success_yn           CHAR(1)     DEFAULT 'N'   NOT NULL,
    error_yn             CHAR(1)     DEFAULT 'N'   NOT NULL,
    error_message        TEXT,
    timeout_yn           CHAR(1)     DEFAULT 'N'   NOT NULL,
    first_create_user_id VARCHAR(50),
    create_dt            TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT pk_chat_api_log PRIMARY KEY (log_key, create_dt),
    CONSTRAINT uk_chat_api_log UNIQUE (company_code, first_create_user_id, log_key, request_dt, create_dt)
) PARTITION BY RANGE (create_dt);

-- 테이블 코멘트
COMMENT ON TABLE chat_api_log IS '외부 API 송수신 로그 테이블 (AI Chat)';

-- 컬럼 코멘트
COMMENT ON COLUMN chat_api_log.company_code IS '회사코드';
COMMENT ON COLUMN chat_api_log.log_key IS '로그 고유키 (PK)';
COMMENT ON COLUMN chat_api_log.vendor IS '외부 벤더명(예: WRTN)';
COMMENT ON COLUMN chat_api_log.api_path IS 'API 경로';
COMMENT ON COLUMN chat_api_log.api_base_url IS '기본 URL';
COMMENT ON COLUMN chat_api_log.api_full_url IS 'API 호출 URL';
COMMENT ON COLUMN chat_api_log.http_method IS 'HTTP 메서드';
COMMENT ON COLUMN chat_api_log.request_dt IS '요청 일시';
COMMENT ON COLUMN chat_api_log.request_header IS '요청 헤더';
COMMENT ON COLUMN chat_api_log.request_query_string IS 'Query String';
COMMENT ON COLUMN chat_api_log.request_body IS '요청 Body';
COMMENT ON COLUMN chat_api_log.response_dt IS '응답 일시';
COMMENT ON COLUMN chat_api_log.response_status_code IS 'HTTP 응답 코드';
COMMENT ON COLUMN chat_api_log.response_header IS '응답 헤더';
COMMENT ON COLUMN chat_api_log.response_body IS '응답 Body';
COMMENT ON COLUMN chat_api_log.response_body_size IS '응답 Body 크기';
COMMENT ON COLUMN chat_api_log.response_time_ms IS '응답 시간';
COMMENT ON COLUMN chat_api_log.call_status IS 'API 호출 상태(SUCCESS: 성공, FAIL: 실패, TIMEOUT: 타임아웃)';
COMMENT ON COLUMN chat_api_log.success_yn IS 'API 호출 성공 여부 (Y: 성공, N: 실패)';
COMMENT ON COLUMN chat_api_log.error_yn IS '에러 발생 여부 (Y: 에러 발생, N: 정상)';
COMMENT ON COLUMN chat_api_log.error_message IS '에러 메시지';
COMMENT ON COLUMN chat_api_log.timeout_yn IS '타임아웃 발생 여부 (Y: 타임아웃, N: 정상)';
COMMENT ON COLUMN chat_api_log.first_create_user_id IS '최초 생성자 ID - API 호출을 수행한 사용자 ID';
COMMENT ON COLUMN chat_api_log.create_dt IS '생성 일시';

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_chat_api_log_log_key ON chat_api_log (log_key);
COMMENT ON INDEX idx_chat_api_log_log_key IS '로그키 인덱스 (JOIN 성능 향상)';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_01
    ON chat_api_log (company_code, request_dt DESC)
    WITH (fillfactor = 100);
COMMENT ON INDEX idx_chat_api_log_01 IS '일자별 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_02
    ON chat_api_log (company_code, vendor, request_dt DESC)
    WHERE vendor IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_02 IS '벤더별 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_03
    ON chat_api_log (company_code, api_path, request_dt DESC)
    WHERE api_path IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_03 IS 'API 경로별 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_04
    ON chat_api_log (company_code, request_dt DESC)
    WHERE success_yn = 'N';
COMMENT ON INDEX idx_chat_api_log_04 IS '실패 건 조회용 인덱스 (부분 인덱스)';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_05
    ON chat_api_log (company_code, request_dt DESC)
    WHERE timeout_yn = 'Y';
COMMENT ON INDEX idx_chat_api_log_05 IS '타임아웃 건 조회용 인덱스 (부분 인덱스)';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_06
    ON chat_api_log (company_code, first_create_user_id, request_dt DESC)
    WHERE first_create_user_id IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_06 IS '특정 사용자의 API 호출 이력 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_07
    ON chat_api_log (company_code, call_status, request_dt DESC)
    WHERE call_status IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_07 IS 'API 호출 상태(SUCCESS, FAIL, TIMEOUT)별로 로그를 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_08
    ON chat_api_log (company_code, response_time_ms DESC, request_dt DESC)
    WHERE response_time_ms IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_08 IS '응답 시간 분석용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_09
    ON chat_api_log (company_code, vendor, call_status, request_dt DESC)
    WHERE vendor IS NOT NULL AND call_status IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_09 IS '벤더별 상태 조회용 인덱스';

CREATE INDEX IF NOT EXISTS idx_chat_api_log_10
    ON chat_api_log (company_code, first_create_user_id, call_status, request_dt DESC)
    WHERE first_create_user_id IS NOT NULL AND call_status IS NOT NULL;
COMMENT ON INDEX idx_chat_api_log_10 IS '사용자별 상태 조회용 인덱스';

-- 제약조건 코멘트
COMMENT ON CONSTRAINT pk_chat_api_log ON chat_api_log IS 'PK (log_key, create_dt)';
COMMENT ON CONSTRAINT uk_chat_api_log ON chat_api_log IS '회사코드, 사용자ID, 로그키, 요청일시, 생성일시';
