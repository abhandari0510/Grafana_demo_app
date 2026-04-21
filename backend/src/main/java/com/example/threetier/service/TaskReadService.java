package com.example.threetier.service;

import com.example.threetier.dto.TaskResponse;
import com.example.threetier.entity.Task;
import com.example.threetier.repository.TaskRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskReadService {

    private final TaskRepository taskRepository;

    public TaskReadService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(this::toResponse)
            .toList();
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(task.getId(), task.getTitle(), task.isCompleted(), task.getCreatedAt());
    }
}
