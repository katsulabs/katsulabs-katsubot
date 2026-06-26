package xs.aichat.service;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 썸네일 생성 검증용 테스트 이미지 생성 유틸.
 */
final class ThumbnailTestImageFactory {

    private ThumbnailTestImageFactory() {
    }

    static Map<String, byte[]> allSamples() throws IOException {
        Map<String, byte[]> samples = new LinkedHashMap<>();
        // 수정 전 버그 재현: ratio 절삭 시 scaledHeight=0 (10000*0.0048=48, 100*0.0048=0)
        samples.put("wide_panorama_10000x100.png", pngBytes(10000, 100, new Color(30, 120, 200)));
        samples.put("wide_panorama_2000x50.png", pngBytes(2000, 50, new Color(200, 60, 60)));
        samples.put("tall_portrait_50x2000.png", pngBytes(50, 2000, new Color(60, 180, 80)));
        samples.put("normal_800x600.png", pngBytes(800, 600, new Color(255, 180, 40)));
        samples.put("square_48x48.png", pngBytes(48, 48, new Color(120, 80, 200)));
        samples.put("tiny_1x1.png", pngBytes(1, 1, Color.DARK_GRAY));
        return samples;
    }

    static void exportAll(Path outputDir) throws IOException {
        Files.createDirectories(outputDir);
        for (Map.Entry<String, byte[]> entry : allSamples().entrySet()) {
            Path target = outputDir.resolve(entry.getKey());
            Files.write(target, entry.getValue());
        }
    }

    static byte[] pngBytes(int width, int height, Color fill) throws IOException {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();
        graphics.setColor(fill);
        graphics.fillRect(0, 0, width, height);
        // 가로/세로 구분을 위해 얇은 대각선 패턴
        graphics.setColor(fill.brighter());
        for (int x = 0; x < width; x += Math.max(1, width / 20)) {
            graphics.drawLine(x, 0, x, Math.min(height - 1, 2));
        }
        graphics.dispose();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", out);
            return out.toByteArray();
        }
    }
}
