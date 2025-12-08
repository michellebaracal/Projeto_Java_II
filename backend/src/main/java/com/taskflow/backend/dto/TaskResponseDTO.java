package com.taskflow.backend.dto;

import java.time.LocalDate;

import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;

import lombok.Data;

@Data
public class TaskResponseDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskPriority priority;
    private TaskStatus status;
    private Long projectId;
}