-- ========================================
-- 파티션 생성 및 관리 함수
-- ========================================

-- 월별 파티션 자동 생성 함수
CREATE OR REPLACE FUNCTION create_chat_api_log_partition(
    yearMonth DATE
)
    RETURNS TABLE (
                      partition_name TEXT,
                      status TEXT,
                      message TEXT
                  ) AS
$$
DECLARE
    v_partition_name TEXT;
    v_start_date     DATE;
    v_end_date       DATE;
    v_status         TEXT;
    v_message        TEXT;
    v_exists         BOOLEAN;
BEGIN
    v_start_date := DATE_TRUNC('month', yearMonth);
    v_partition_name := 'chat_api_log_' || TO_CHAR(v_start_date, 'YYYYMM');
    v_end_date := v_start_date + INTERVAL '1 month';

    SELECT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = v_partition_name
          AND n.nspname = current_schema()
    ) INTO v_exists;

    IF v_exists THEN
        v_status := 'EXISTS';
        v_message := '파티션이 이미 존재합니다: ' || v_partition_name ||
                     ' (기간: ' || v_start_date || ' ~ ' || v_end_date || ')';
        RAISE NOTICE '%', v_message;
        RETURN QUERY SELECT v_partition_name, v_status, v_message;
        RETURN;
    END IF;

    BEGIN
        EXECUTE format(
                'CREATE TABLE %I PARTITION OF chat_api_log
                FOR VALUES FROM (%L) TO (%L)
                WITH (
                    fillfactor = 100,
                    autovacuum_vacuum_threshold = 10,
                    autovacuum_vacuum_scale_factor = 0,
                    autovacuum_analyze_threshold = 10,
                    autovacuum_analyze_scale_factor = 0,
                    autovacuum_vacuum_cost_limit = 2000,
                    autovacuum_vacuum_cost_delay = 2
                )',
                v_partition_name,
                v_start_date,
                v_end_date
                );

        v_status := 'CREATED';
        v_message := '파티션 생성 완료: ' || v_partition_name ||
                     ' (기간: ' || v_start_date || ' ~ ' || v_end_date || ')';
        RAISE NOTICE '%', v_message;
    EXCEPTION
        WHEN OTHERS THEN
            v_status := 'ERROR';
            v_message := '파티션 생성 실패: ' || v_partition_name || ' - ' || SQLERRM;
            RAISE WARNING '%', v_message;
    END;

    RETURN QUERY SELECT v_partition_name, v_status, v_message;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_chat_api_log_partition IS '월별 파티션 자동 생성 함수';

-- ========================================
-- INSERT 시 자동 파티션 생성 트리거
-- ========================================

-- INSERT 전에 필요한 파티션을 자동 생성하는 트리거 함수
CREATE OR REPLACE FUNCTION auto_create_chat_api_log_partition()
    RETURNS TRIGGER AS
$$
DECLARE
    v_partition_date DATE;
    v_partition_name TEXT;
    v_exists         BOOLEAN;
BEGIN
    v_partition_date := DATE_TRUNC('month', NEW.create_dt);
    v_partition_name := 'chat_api_log_' || TO_CHAR(v_partition_date, 'YYYYMM');

    SELECT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = v_partition_name
          AND n.nspname = current_schema()
    ) INTO v_exists;

    IF NOT v_exists THEN
        PERFORM create_chat_api_log_partition(v_partition_date);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_create_chat_api_log_partition IS 'INSERT 전에 필요한 파티션을 자동 생성하는 트리거 함수';

-- 트리거 생성
CREATE TRIGGER trg_auto_create_chat_api_log_partition
    BEFORE INSERT
    ON chat_api_log
    FOR EACH ROW
EXECUTE FUNCTION auto_create_chat_api_log_partition();

COMMENT ON TRIGGER trg_auto_create_chat_api_log_partition ON chat_api_log IS 'INSERT 시 필요한 파티션을 자동 생성하는 트리거';

-- sample
-- SELECT * FROM create_chat_api_log_partition(CURRENT_DATE);
-- SELECT * FROM create_chat_api_log_partition(CURRENT_DATE + INTERVAL '1 month');