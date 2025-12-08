package com.taskflow.backend.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    public TaskService(TaskRepository taskRepository, ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
    }

    public Task createTask(@NonNull Long projectId, Task task) {
        var project = projectService.findProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado com ID: " + projectId));

        task.setProject(project);

        return taskRepository.save(task);
    }

    public List<Task> findAllTasksByProjectId(@NonNull Long projectId) {
        if (!projectService.findProjectById(projectId).isPresent()) {
            throw new RuntimeException("Projeto não encontrado com ID: " + projectId);
        }
        return taskRepository.findByProjectId(projectId);
    }

    public Optional<Task> findTaskByIdAndProjectId(Long taskId, Long projectId) {
        return taskRepository.findByIdAndProjectId(taskId, projectId);
    }

    public Task updateTask(Long projectId, Long taskId, Task taskDetails) {
        var existingTask = findTaskByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException(
                        "Tarefa não encontrada com ID: " + taskId + " no Projeto: " + projectId));

        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setDueDate(taskDetails.getDueDate());
        existingTask.setPriority(taskDetails.getPriority());
        existingTask.setStatus(taskDetails.getStatus());

        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long projectId, Long taskId) {
        var existingTask = findTaskByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException(
                        "Tarefa não encontrada com ID: " + taskId + " no Projeto: " + projectId));

        taskRepository.delete(Objects.requireNonNull(existingTask));
    }
}
