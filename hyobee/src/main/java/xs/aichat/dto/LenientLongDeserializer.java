package xs.aichat.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * JSON에서 숫자 또는 문자열로 온 값을 Long으로 변환 (예: HiCloud fileSize "2517856").
 */
public class LenientLongDeserializer extends JsonDeserializer<Long> {

    @Override
    public Long deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonToken t = p.currentToken();
        if (t == JsonToken.VALUE_NULL) {
            return null;
        }
        if (t == JsonToken.VALUE_STRING) {
            String s = p.getValueAsString();
            if (s == null || s.trim().isEmpty()) {
                return null;
            }
            return Long.parseLong(s.trim());
        }
        if (t == JsonToken.VALUE_NUMBER_INT || t == JsonToken.VALUE_NUMBER_FLOAT) {
            return p.getLongValue();
        }
        return null;
    }
}
