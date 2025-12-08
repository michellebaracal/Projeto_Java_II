package com.taskflow.backend.dto;

import java.time.LocalDate;

import com.taskflow.backend.model.ProjectStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequestDTO {

    @NotBlank(message = "O título do projeto é obrigatório.")
    @Size(max = 100, message = "O título não pode exceder 100 caracteres.")
    private String title;

    @Size(max = 500, message = "A descrição não pode exceder 500 caracteres.")
    private String description;

    @NotNull(message = "O status inicial do projeto é obrigatório.")
    private ProjectStatus status;

    @NotNull(message = "A data de início é obrigatória.")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "O CEP é obrigatório.")
    @Size(min = 8, max = 9, message = "O CEP deve ter 8 caracteres.")
    private String cep;

    private String logradouro;

    private String bairro;

    private String cidade;

    @Size(max = 2, message = "A UF deve ter 2 caracteres.")
    private String uf;

    @NotBlank(message = "O número é obrigatório.")
    @Size(max = 20, message = "O número é muito longo.")
    private String numero;
}