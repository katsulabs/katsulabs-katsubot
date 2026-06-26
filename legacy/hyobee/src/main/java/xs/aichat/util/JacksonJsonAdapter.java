package xs.aichat.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class JacksonJsonAdapter implements JsonAdapter {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new IllegalArgumentException("JSON serialization failed", e);
        }
    }

    @Override
    public <T> T fromJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            throw new IllegalArgumentException("JSON deserialization failed", e);
        }
    }

    @Override
    public <T> T fromJson(String json, TypeReference<T> typeReference) {
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (Exception e) {
            throw new IllegalArgumentException("JSON deserialization failed", e);
        }
    }

    @Override
    public <T> T toMap(Object obj) {
        return objectMapper.convertValue(obj, new TypeReference<T>() {});
    }

    @Override
    public <T> T convertValue(Object obj, Class<T> clazz) {
        return objectMapper.convertValue(obj, clazz);
    }

    @Override
    public JsonNode toTree(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new IllegalArgumentException("JSON tree parsing failed", e);
        }
    }

    @Override
    public boolean isValidJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return false;
        }
        try {
            objectMapper.readTree(json);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
