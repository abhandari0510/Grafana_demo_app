package com.example.threetier.controller;

import com.example.threetier.dto.CreateTaskRequest;
import com.example.threetier.dto.TaskResponse;
import com.example.threetier.service.FailureSimulationService;
import com.example.threetier.service.TaskReadService;
import com.example.threetier.service.TaskWriteService;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private static final Logger log = LoggerFactory.getLogger(TaskController.class);

    private final TaskReadService taskReadService;
    private final TaskWriteService taskWriteService;
    private final FailureSimulationService failureSimulationService;

    public TaskController(TaskReadService taskReadService,
                          TaskWriteService taskWriteService,
                          FailureSimulationService failureSimulationService) {
        this.taskReadService = taskReadService;
        this.taskWriteService = taskWriteService;
        this.failureSimulationService = failureSimulationService;
    }

    @GetMapping
    public List<TaskResponse> getTasks() {
        return taskReadService.getAllTasks();
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse created = taskWriteService.createTask(request.getTitle());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/toggle")
    public TaskResponse toggleTask(@PathVariable Long id) {
        return taskWriteService.toggleTask(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskWriteService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fail")
    public ResponseEntity<Void> intentionallyFail() {
        log.warn("intentional_failure_endpoint_called");
        failureSimulationService.triggerIntentionalFailure();
        return ResponseEntity.ok().build();
    }
}
