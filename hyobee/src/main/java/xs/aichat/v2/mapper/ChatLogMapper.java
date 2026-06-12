package xs.aichat.v2.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChatLogMapper {

    void insertChatApiLog(@Param("companyCode") String companyCode,
                          @Param("logKey") String logKey,
                          @Param("vendor") String vendor,
                          @Param("apiPath") String apiPath,
                          @Param("apiBaseUrl") String apiBaseUrl,
                          @Param("apiFullUrl") String apiFullUrl,
                          @Param("httpMethod") String httpMethod,
                          @Param("requestDt") String requestDt,
                          @Param("requestHeader") String requestHeader,
                          @Param("requestQueryString") String requestQueryString,
                          @Param("requestBody") String requestBody,
                          @Param("responseDt") String responseDt,
                          @Param("responseStatusCode") String responseStatusCode,
                          @Param("responseHeader") String responseHeader,
                          @Param("responseBody") String responseBody,
                          @Param("responseBodySize") Integer responseBodySize,
                          @Param("responseTimeMs") Long responseTimeMs,
                          @Param("callStatus") String callStatus,
                          @Param("successYn") String successYn,
                          @Param("errorYn") String errorYn,
                          @Param("errorMessage") String errorMessage,
                          @Param("timeoutYn") String timeoutYn,
                          @Param("firstCreateUserId") String firstCreateUserId,
                          @Param("createDt") String createDt
    );

    void insertChatApiFileLog(@Param("companyCode") String companyCode,
                              @Param("logKey") String logKey,
                              @Param("fileLogKey") String fileLogKey,
                              @Param("fileName") String fileName,
                              @Param("fileSize") Integer fileSize,
                              @Param("fileType") String fileType,
                              @Param("mimeType") String mimeType,
                              @Param("successYn") String successYn,
                              @Param("errorMessage") String errorMessage,
                              @Param("createDt") String createDt
    );

    void updateChatApiFileLog(@Param("companyCode") String companyCode,
                              @Param("fileLogKey") String fileLogKey,
                              @Param("successYn") String successYn,
                              @Param("errorMessage") String errorMessage
    );

    void updateChatApiFileLogKey(@Param("companyCode") String companyCode,
                                 @Param("fileLogKey") String fileLogKey,
                                 @Param("logKey") String logKey
    );
}
