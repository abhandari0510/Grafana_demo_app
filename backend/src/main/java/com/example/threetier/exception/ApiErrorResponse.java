package com.example.threetier.exception;

import java.time.OffsetDateTime;

public record ApiErrorResponse(
    OffsetDateTime timestamp,
    int status,
    String code,
    String message,
    String path,
    String requestId
) {
}
