package com.taskflow.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.taskflow.backend.model.ProjectStatus;

import lombok.Data;

@Data
public class ProjectResponseDTO {

    private Long id;
    private String title;
    private String description;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String cep;
    private String logradouro;
    private String bairro;
    private String cidade;
    private String uf;
    private String numero;
    private List<TaskResponseDTO> tasks;
}