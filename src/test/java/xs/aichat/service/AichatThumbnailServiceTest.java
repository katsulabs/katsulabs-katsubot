package xs.aichat.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import xs.aichat.dto.ThumbnailResult;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

@DisplayName("AichatThumbnailService 단위 테스트")
class AichatThumbnailServiceTest {

    private AichatThumbnailService thumbnailService;

    @TempDir
    Path tempUploadDir;

    @BeforeEach
    void setUp() {
        thumbnailService = new AichatThumbnailService();
    }

    @Test
    @DisplayName("극단 비율 이미지도 썸네일 생성에 성공한다")
    void generatesThumbnailForExtremeAspectRatios() throws IOException {
        for (Map.Entry<String, byte[]> sample : ThumbnailTestImageFactory.allSamples().entrySet()) {
            String filename = sample.getKey();
            byte[] imageBytes = sample.getValue();

            assertThatCode(() -> createThumbnail(filename, imageBytes))
                    .as("sample: %s", filename)
                    .doesNotThrowAnyException();
        }
    }

    @Test
    @DisplayName("10000x100 파노라마는 48x48 썸네일 PNG를 만든다")
    void widePanoramaProduces48x48Thumbnail() throws IOException {
        byte[] imageBytes = ThumbnailTestImageFactory.allSamples().get("wide_panorama_10000x100.png");
        ThumbnailResult result = createThumbnail("wide_panorama_10000x100.png", imageBytes);

        assertThat(result.getThumbnailBase64()).isNotBlank();
        assertThat(result.getThumbnailUrl()).contains("/files/");

        Path thumbFile = tempUploadDir.resolve(result.getThumbnailId())
                .resolve("thumb_wide_panorama_10000x100.png");
        assertThat(Files.exists(thumbFile)).isTrue();
        assertThat(Files.size(thumbFile)).isGreaterThan(0);
    }

    @Test
    @DisplayName("test-data 폴더에 수동 업로드용 샘플 PNG를 생성한다")
    void exportManualTestFixtures() throws IOException {
        Path projectRoot = Path.of("").toAbsolutePath().normalize();
        Path outputDir = projectRoot.resolve("test-data/aichat-thumbnail");
        ThumbnailTestImageFactory.exportAll(outputDir);

        long pngCount;
        try (var files = Files.list(outputDir)) {
            pngCount = files
                    .filter(path -> path.getFileName().toString().endsWith(".png"))
                    .count();
        }
        assertThat(pngCount).isEqualTo(ThumbnailTestImageFactory.allSamples().size());
    }

    private ThumbnailResult createThumbnail(String filename, byte[] imageBytes) throws IOException {
        String folderUuid = UUID.randomUUID().toString();
        return thumbnailService.generateThumbnailWithBase64(
                imageBytes, filename, folderUuid, tempUploadDir);
    }
}
