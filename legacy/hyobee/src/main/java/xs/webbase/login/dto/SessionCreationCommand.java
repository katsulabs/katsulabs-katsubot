package xs.webbase.login.dto;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class SessionCreationCommand {
    String languageCode;
    boolean masterLogin;

    public static SessionCreationCommand of(String languageCode) {
        return new SessionCreationCommand(languageCode, false);
    }

    public static SessionCreationCommand of(String languageCode, boolean masterLogin) {
        return new SessionCreationCommand(languageCode, masterLogin);
    }
}
