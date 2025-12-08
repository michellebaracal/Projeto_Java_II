package com.taskflow.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.TaskRequestDTO;
import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.mapper.TaskMapper;
import com.taskflow.backend.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;

    public TaskController(TaskService taskService, TaskMapper taskMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(
            @PathVariable @NonNull Long projectId,
            @Valid @RequestBody TaskRequestDTO taskDTO) {

        var task = taskMapper.toEntity(taskDTO);

        var createdTask = taskService.createTask(projectId, task);

        var responseDTO = taskMapper.toResponseDTO(createdTask);

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasksByProject(@PathVariable @NonNull Long projectId) {

        var tasks = taskService.findAllTasksByProjectId(projectId);

        var responseDTOs = tasks.stream()
                .map(taskMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {

        var task = taskService.findTaskByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new RuntimeException(
                        "Tarefa não encontrada com ID: " + taskId + " no Projeto: " + projectId));

        var responseDTO = taskMapper.toResponseDTO(task);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequestDTO taskDTO) {

        var taskDetails = taskMapper.toEntity(taskDTO);

        var updatedTask = taskService.updateTask(projectId, taskId, taskDetails);

        var responseDTO = taskMapper.toResponseDTO(updatedTask);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId) {

        taskService.deleteTask(projectId, taskId);

        return ResponseEntity.noContent().build();
    }
}