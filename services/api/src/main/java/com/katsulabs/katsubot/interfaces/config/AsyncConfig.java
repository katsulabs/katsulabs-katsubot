package com.katsulabs.katsubot.interfaces.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class AsyncConfig {

    /**
     * SSE 스트리밍은 별도 스레드에서 RAG를 호출한다. 요청 스레드의 JWT·세션 컨텍스트를 전파한다.
     */
    @Bean(name = "sseExecutor")
    Executor sseExecutor() {
        ExecutorService delegate = Executors.newVirtualThreadPerTaskExecutor();
        return command -> {
            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
            delegate.execute(() -> {
                try {
                    if (requestAttributes != null) {
                        RequestContextHolder.setRequestAttributes(requestAttributes, true);
                    }
                    command.run();
                } finally {
                    RequestContextHolder.resetRequestAttributes();
                }
            });
        };
    }
}
