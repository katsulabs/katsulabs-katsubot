package xs.aichat.v2.util;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.net.URLEncoder.encode;
import static java.nio.charset.StandardCharsets.*;

public class DocumentLinkBuilder {

    private static final String INTERNAL_BOARD_VIEW_URL =
            "https://hope2.hyosung.com/WebSite/Basic/Board/BoardView.aspx";
    private static final Pattern JOURNAL_PATH_PATTERN = Pattern.compile("^/journal/([^/?#]+)");
    private static final Pattern TYPE_QUERY_PATTERN = Pattern.compile("[?&](?:type|docType|doc_type)=([^&#]+)");
    private static final Pattern INTERNAL_BOARD_FDID_PATTERN =
            Pattern.compile("[?&]fdid=([^&#]+)", Pattern.CASE_INSENSITIVE);

    public static String resolveSourceUrl(String sourceType, String docType, String sourceId, String fallbackUrl) {
        return resolveSourceUrl(sourceType, docType, sourceId, null, fallbackUrl);
    }

    public static String resolveSourceUrl(
            String sourceType,
            String docType,
            String sourceId,
            String boardId,
            String fallbackUrl
    ) {
        if (isInternalSource(sourceType, docType)) {
            return resolveInternalSourceUrl(sourceId, boardId, fallbackUrl);
        }
        if (!"rnd".equalsIgnoreCase(nullToEmpty(sourceType))) {
            return fallbackUrl;
        }
        // 1) sourceId/docType가 있으면 우선 사용
        if (!isBlank(sourceId) && !isBlank(docType)) {
            return buildJournalLandingPath(docType, sourceId);
        }
        // 2) fallbackUrl(/journal/{id}?type=paper)에서 복구
        Parsed parsed = parseLegacyJournalUrl(fallbackUrl);
        if (parsed != null) {
            return buildJournalLandingPath(parsed.docType, parsed.journalId);
        }
        // 3) 못 만들면 원본 유지
        return fallbackUrl;
    }

    public static String buildJournalLandingPath(String docType, String id) {
        String normalizedDocType = normalizeDocType(docType);
        if ("internal".equals(normalizedDocType)) {
            throw new IllegalArgumentException("internal 문서는 buildInternalBoardUrl을 사용하세요.");
        }
        String encodedId = validateAndEncodeId(id);
        return "/xs/aichat/v2/rnd/journals/" + encodedId + "/landing?docType=" + encode(normalizedDocType, UTF_8);
    }

    /**
     * 사내검색(internal) 게시판 상세 URL.
     * id → MsgId, boardId → fdid
     */
    public static String buildInternalBoardUrl(String msgId, String boardId) {
        String encodedMsgId = validateAndEncodeId(msgId);
        String encodedBoardId = validateAndEncodeId(boardId);
        return INTERNAL_BOARD_VIEW_URL
                + "?system=Board"
                + "&fdid=" + encodedBoardId
                + "&MsgId=" + encodedMsgId;
    }

    public static String resolveInternalSourceUrl(String msgId, String boardId, String fallbackUrl) {
        if (!isBlank(msgId) && !isBlank(boardId)) {
            return buildInternalBoardUrl(msgId, boardId);
        }
        if (!isBlank(msgId)) {
            String parsedBoardId = parseInternalBoardId(fallbackUrl);
            if (!isBlank(parsedBoardId)) {
                return buildInternalBoardUrl(msgId, parsedBoardId);
            }
        }
        if (isInternalBoardUrl(fallbackUrl)) {
            return fallbackUrl;
        }
        return fallbackUrl;
    }

    public static String buildJournalLandingJspUrl(String docType, String id) {
        String normalizedDocType = normalizeDocType(docType);
        String popupPath;
        switch (normalizedDocType) {
            case "paper":
            case "journal":
                popupPath = "/xs/aichat/v2/popup/aichatPopUpPaper.jsp";
                break;
            case "patent":
                popupPath = "/xs/aichat/v2/popup/aichatPopUpPatent.jsp";
                break;
            case "article":
            case "news":
                popupPath = "/xs/aichat/v2/popup/aichatPopUpNews.jsp";
                break;
            default:
                throw new IllegalArgumentException("지원하지 않는 문서 타입입니다: " + normalizedDocType);
        }

        String encodedId = validateAndEncodeId(id);
        return "/webapps" + popupPath + "?journal_id=" + encodedId;
    }

    private static String normalizeDocType(String docType) {
        return docType == null ? "" : docType.trim().toLowerCase();
    }

    private static boolean isInternalSource(String sourceType, String docType) {
        return "internal".equalsIgnoreCase(normalizeDocType(docType))
                || "internal".equalsIgnoreCase(nullToEmpty(sourceType));
    }

    private static boolean isInternalBoardUrl(String url) {
        return !isBlank(url) && url.contains("BoardView.aspx");
    }

    private static String parseInternalBoardId(String url) {
        if (isBlank(url)) {
            return null;
        }
        Matcher matcher = INTERNAL_BOARD_FDID_PATTERN.matcher(url);
        return matcher.find() ? matcher.group(1) : null;
    }

    private static String validateAndEncodeId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("저널 식별값이 없습니다.");
        }
        return encode(id, UTF_8);
    }

    private static Parsed parseLegacyJournalUrl(String url) {
        if (isBlank(url)) return null;
        String normalized = normalizeRawUrl(url); // 혹시 ""/journal/..."" 같은 값 대비
        Matcher pathMatcher = JOURNAL_PATH_PATTERN.matcher(normalized);
        if (!pathMatcher.find()) return null;
        String journalId = pathMatcher.group(1);
        Matcher typeMatcher = TYPE_QUERY_PATTERN.matcher(normalized);
        String type = typeMatcher.find() ? typeMatcher.group(1) : null;
        if (isBlank(journalId) || isBlank(type)) return null;
        return new Parsed(journalId, type);
    }
    private static String normalizeRawUrl(String raw) {
        String v = raw.trim();
        while (v.length() >= 2 && v.startsWith("\"") && v.endsWith("\"")) {
            v = v.substring(1, v.length() - 1).trim();
        }
        return v;
    }

    private static String encodeRequired(String value, String message) {
        if (isBlank(value)) throw new IllegalArgumentException(message);
        return URLEncoder.encode(value.trim(), StandardCharsets.UTF_8);
    }
    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
    private static class Parsed {
        final String journalId;
        final String docType;
        Parsed(String journalId, String docType) {
            this.journalId = journalId;
            this.docType = docType;
        }
    }

}
