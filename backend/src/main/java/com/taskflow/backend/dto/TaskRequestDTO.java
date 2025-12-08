package com.taskflow.backend.dto;

import java.time.LocalDate;

import com.taskflow.backend.model.TaskPriority;
import com.taskflow.backend.model.TaskStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequestDTO {

    @NotBlank(message = "O título da tarefa é obrigatório.")
    @Size(max = 150, message = "O título não pode exceder 150 caracteres.")
    private String title;

    private String description;

    @NotNull(message = "A data de vencimento é obrigatória.")
    private LocalDate dueDate;

    @NotNull(message = "A prioridade é obrigatória.")
    private TaskPriority priority;

    @NotNull(message = "O status inicial é obrigatório.")
    private TaskStatus status;
}