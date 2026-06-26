package xs.aichat.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Map;

public interface JsonAdapter {

    String toJson(Object obj);

    <T> T fromJson(String json, Class<T> clazz);

    <T> T fromJson(String json, TypeReference<T> typeReference);

    <T> T toMap(Object obj);

    <T> T convertValue(Object obj, Class<T> clazz);

    JsonNode toTree(String json);

    boolean isValidJson(String json);
}
