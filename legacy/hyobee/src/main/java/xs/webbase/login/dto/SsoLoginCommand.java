package xs.webbase.login.dto;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.experimental.Accessors;

/**
 * Hyobee SSO {@code loginHyobeeSSO} 입력.
 */
@Value
@AllArgsConstructor
@Accessors(fluent = true)
public class SsoLoginCommand {
    String samAccountName;
    String companyCode;
    String languageCode;
}
