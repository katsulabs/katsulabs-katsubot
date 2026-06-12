package xs.aichat.v2.dto.wrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JsonDataWrapper<T> {

    private T jsonData;
}
