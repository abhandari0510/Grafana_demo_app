package com.example.threetier.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class AccessLogFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AccessLogFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - start;
            log.info("http_access method={} path={} status={} durationMs={} remoteAddr={} userAgent={}",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus(),
                duration,
                request.getRemoteAddr(),
                compact(request.getHeader("User-Agent")));
        }
    }

    private String compact(String value) {
        if (value == null || value.isBlank()) {
            return "unknown";
        }
        return value.replaceAll("\\s+", " ").trim();
    }
}
