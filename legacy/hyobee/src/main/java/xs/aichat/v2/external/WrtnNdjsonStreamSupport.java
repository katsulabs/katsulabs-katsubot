package xs.aichat.v2.external;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import reactor.core.publisher.Flux;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * AI Gateway WRTN 스트림은 Content-Type은 {@code text/event-stream}이지만
 * 본문은 {@code data:} 접두사 없는 NDJSON 라인이다. WebClient {@code bodyToFlux(String.class)}
 * 는 SSE 프레이밍을 기대해 청크가 비어 버리므로 DataBuffer를 줄 단위로 분리한다.
 */
public final class WrtnNdjsonStreamSupport {

    private WrtnNdjsonStreamSupport() {
    }

    public static Flux<String> ndjsonLines(Flux<DataBuffer> buffers) {
        AtomicReference<StringBuilder> remainder = new AtomicReference<>(new StringBuilder());
        return buffers
                .concatMap(buffer -> {
                    byte[] bytes = new byte[buffer.readableByteCount()];
                    buffer.read(bytes);
                    DataBufferUtils.release(buffer);
                    remainder.get().append(new String(bytes, StandardCharsets.UTF_8));
                    return Flux.fromIterable(drainCompleteLines(remainder));
                })
                .concatWith(Flux.defer(() -> {
                    String tail = remainder.get().toString().trim();
                    remainder.set(new StringBuilder());
                    return tail.isEmpty() ? Flux.empty() : Flux.just(tail);
                }));
    }

    private static List<String> drainCompleteLines(AtomicReference<StringBuilder> remainderRef) {
        StringBuilder remainder = remainderRef.get();
        List<String> lines = new ArrayList<>();
        int newlineIndex;
        while ((newlineIndex = remainder.indexOf("\n")) >= 0) {
            String line = remainder.substring(0, newlineIndex).trim();
            remainder.delete(0, newlineIndex + 1);
            if (!line.isEmpty()) {
                lines.add(line);
            }
        }
        return lines;
    }
}
