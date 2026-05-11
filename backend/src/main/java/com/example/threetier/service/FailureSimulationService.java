package com.example.threetier.service;

import com.example.threetier.exception.IntentionalFailureException;
import org.springframework.stereotype.Service;

@Service
public class FailureSimulationService {

    public void triggerIntentionalFailure() {
        throw new IntentionalFailureException("Intentional failure endpoint invoked for resilience demo");
    }
}
