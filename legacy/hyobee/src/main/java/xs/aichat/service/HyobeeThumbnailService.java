package xs.aichat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import xs.aichat.dto.ThumbnailResult;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.Optional;
import javax.imageio.ImageIO;

/**
 * Thumbnail generation and lookup for chat file attachments.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HyobeeThumbnailService {

    private static final int THUMBNAIL_WIDTH = 48;
    private static final int THUMBNAIL_HEIGHT = 48;

    /**
     * Generates a 48x48 thumbnail and Base64 payload.
     */
    public ThumbnailResult generateThumbnailWithBase64(byte[] imageBytes, String originalFilename, String folderUuid, Path uploadPath) throws IOException {
        try {
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
            if (originalImage == null) {
                throw new IOException("???? ?? ? ????.");
            }

            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();
            if (originalWidth <= 0 || originalHeight <= 0) {
                throw new IOException(String.format(
                        "유효하지 않은 이미지 크기입니다. width=%d, height=%d", originalWidth, originalHeight));
            }

            double ratio = Math.min(
                    (double) THUMBNAIL_WIDTH / originalWidth,
                    (double) THUMBNAIL_HEIGHT / originalHeight);
            // (int) 절삭만 사용하면 극단적 가로/세로 비율에서 한쪽이 0이 되어 getScaledInstance가 실패함
            int scaledWidth = Math.max(1, (int) Math.round(originalWidth * ratio));
            int scaledHeight = Math.max(1, (int) Math.round(originalHeight * ratio));

            BufferedImage thumbnail = new BufferedImage(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, BufferedImage.TYPE_INT_RGB);
            Graphics2D graphics2D = thumbnail.createGraphics();
            applyQualityHints(graphics2D);

            graphics2D.setColor(java.awt.Color.WHITE);
            graphics2D.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

            int x = (THUMBNAIL_WIDTH - scaledWidth) / 2;
            int y = (THUMBNAIL_HEIGHT - scaledHeight) / 2;

            BufferedImage scaledImage = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D scaledGraphics = scaledImage.createGraphics();
            applyQualityHints(scaledGraphics);
            scaledGraphics.drawImage(originalImage, 0, 0, scaledWidth, scaledHeight, null);
            scaledGraphics.dispose();

            graphics2D.drawImage(scaledImage, x, y, null);
            graphics2D.dispose();

            String thumbnailBase64 = null;
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                ImageIO.write(thumbnail, "png", baos);
                byte[] thumbnailBytes = baos.toByteArray();
                thumbnailBase64 = Base64.getEncoder().encodeToString(thumbnailBytes);
            }

            String thumbnailId = folderUuid;
            String thumbnailFilename = generateThumbnailFilename(originalFilename);

            Path folderPath = uploadPath.resolve(folderUuid);
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }
            Path thumbnailPath = folderPath.resolve(thumbnailFilename);
            ImageIO.write(thumbnail, "png", thumbnailPath.toFile());

            String thumbnailUrl = "/files/" + folderUuid + "/" + thumbnailFilename;

            return new ThumbnailResult(thumbnailId, thumbnailUrl, thumbnailBase64);

        } catch (IOException e) {
            throw e;
        } catch (Exception e) {
            log.warn("썸네일 생성 중 오류 발생. filename={}", originalFilename, e);
            throw new IOException("썸네일 생성 실패: " + e.getMessage(), e);
        }
    }

    private static void applyQualityHints(Graphics2D graphics2D) {
        graphics2D.setRenderingHint(java.awt.RenderingHints.KEY_INTERPOLATION, java.awt.RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics2D.setRenderingHint(java.awt.RenderingHints.KEY_RENDERING, java.awt.RenderingHints.VALUE_RENDER_QUALITY);
        graphics2D.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON);
    }

    /**
     * Loads thumbnail bytes as Base64 by thumbnailId (folder UUID).
     */
    public String getImageByThumbnailId(String thumbnailId, Path uploadPath) {
        if (thumbnailId == null || thumbnailId.isEmpty()) {
            return null;
        }

        try {
            Path folderPath = uploadPath.resolve(thumbnailId).normalize();

            if (!folderPath.startsWith(uploadPath.normalize())) {
                return null;
            }

            if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
                return null;
            }

            String thumbnailFilename = null;
            try (java.util.stream.Stream<Path> files = Files.list(folderPath)) {
                Optional<Path> thumbnailFile = files
                    .filter(Files::isRegularFile)
                    .filter(path -> {
                        String fileName = path.getFileName().toString();
                        String lowerFileName = fileName.toLowerCase();
                        return lowerFileName.startsWith("thumb_") && lowerFileName.endsWith(".png");
                    })
                    .findFirst();

                if (thumbnailFile.isPresent()) {
                    thumbnailFilename = thumbnailFile.get().getFileName().toString();
                }
            }

            if (thumbnailFilename == null) {
                return null;
            }

            Path thumbnailPath = folderPath.resolve(thumbnailFilename).normalize();

            if (!thumbnailPath.startsWith(uploadPath.normalize())) {
                return null;
            }

            if (Files.exists(thumbnailPath) && Files.isRegularFile(thumbnailPath)) {
                byte[] imageBytes = Files.readAllBytes(thumbnailPath);
                return Base64.getEncoder().encodeToString(imageBytes);
            }

            return null;

        } catch (Exception e) {
            return null;
        }
    }

    private String generateThumbnailFilename(String originalFilename) {
        String thumbnailFilename = "thumb_" + originalFilename;
        int lastDotIndex = thumbnailFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            thumbnailFilename = thumbnailFilename.substring(0, lastDotIndex) + ".png";
        } else {
            thumbnailFilename = thumbnailFilename + ".png";
        }
        return thumbnailFilename;
    }
}
