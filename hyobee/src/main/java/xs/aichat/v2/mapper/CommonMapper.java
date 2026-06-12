package xs.aichat.v2.mapper;

import org.apache.ibatis.annotations.Mapper;
import xs.aichat.v2.dto.common.ComMessageLang;

import java.util.List;

@Mapper
public interface CommonMapper {

    List<ComMessageLang> findAllMessages();
}
