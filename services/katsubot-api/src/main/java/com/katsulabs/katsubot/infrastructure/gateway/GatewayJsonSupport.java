package com.katsulabs.katsubot.infrastructure.gateway;

import tools.jackson.databind.JsonNode;

final class GatewayJsonSupport {

    private GatewayJsonSupport() {}

    static String textId(JsonNode node, String field) {
        if (node == null || node.isMissingNode()) {
            return "";
        }
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            return "";
        }
        if (value.isNumber()) {
            return value.asText();
        }
        return value.asText("");
    }

    static String optionalText(JsonNode node, String field) {
        if (node == null || node.isMissingNode() || !node.hasNonNull(field)) {
            return null;
        }
        String raw = node.get(field).asText();
        return raw.isBlank() ? null : raw;
    }

    static String wrtnErrorMessage(String body) {
        if (body == null || body.isBlank()) {
            return null;
        }
        try {
            JsonNode root = new tools.jackson.databind.ObjectMapper().readTree(body);
            JsonNode error = root.path("error");
            if (!error.isMissingNode()) {
                String message = error.path("message").asText("");
                if (!message.isBlank()) {
                    return message;
                }
                return error.path("code").asText(null);
            }
        } catch (Exception ignored) {
            // fall through
        }
        return null;
    }
}
