package xs.aichat.util;

/**
 * 파일 관련 유틸리티 클래스
 */
public class FileUtils {

    /**
     * 파일 확장자 추출 (소문자, 점 제외)
     * @param filename 파일명
     * @return 확장자 (없으면 빈 문자열)
     */
    public static String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    /**
     * 이미지 파일인지 확인
     * @param extension 확장자
     * @return 이미지 파일이면 true
     */
    public static boolean isImageFile(String extension) {
        if (extension == null || extension.isEmpty()) {
            return false;
        }
        String lowerExt = extension.toLowerCase();
        return lowerExt.equals("jpg") || lowerExt.equals("jpeg") || 
               lowerExt.equals("png") || lowerExt.equals("gif") || 
               lowerExt.equals("bmp") || lowerExt.equals("webp");
    }
}

