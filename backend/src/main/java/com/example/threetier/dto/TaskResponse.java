package com.example.threetier.dto;

import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    String title,
    boolean completed,
    LocalDateTime createdAt
) {
}
