package com.example.threetier.service;

import com.example.threetier.dto.TaskResponse;
import com.example.threetier.entity.Task;
import com.example.threetier.exception.ResourceNotFoundException;
import com.example.threetier.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskWriteService {

    private static final Logger log = LoggerFactory.getLogger(TaskWriteService.class);

    private final TaskRepository taskRepository;

    public TaskWriteService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional
    public TaskResponse createTask(String title) {
        Task task = new Task();
        task.setTitle(title.trim());
        task.setCompleted(false);

        Task saved = taskRepository.save(task);
        log.info("task_created id={} title={}", saved.getId(), saved.getTitle());
        return toResponse(saved);
    }

    @Transactional
    public TaskResponse toggleTask(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));

        task.setCompleted(!task.isCompleted());
        Task updated = taskRepository.save(task);
        log.info("task_toggled id={} completed={}", updated.getId(), updated.isCompleted());
        return toResponse(updated);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id " + id);
        }
        taskRepository.deleteById(id);
        log.info("task_deleted id={}", id);
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(task.getId(), task.getTitle(), task.isCompleted(), task.getCreatedAt());
    }
}
