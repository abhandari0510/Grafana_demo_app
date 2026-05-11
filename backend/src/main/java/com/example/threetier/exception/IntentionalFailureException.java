package com.example.threetier.exception;

public class IntentionalFailureException extends RuntimeException {

    public IntentionalFailureException(String message) {
        super(message);
    }
}
