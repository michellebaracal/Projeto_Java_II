package com.taskflow.backend.controller;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.ProjectRequestDTO;
import com.taskflow.backend.dto.ProjectResponseDTO;
import com.taskflow.backend.mapper.ProjectMapper;
import com.taskflow.backend.service.ProjectService;

import jakarta.validation.Valid;
import lombok.NonNull;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectMapper projectMapper;

    public ProjectController(ProjectService projectService, ProjectMapper projectMapper) {
        this.projectService = projectService;
        this.projectMapper = projectMapper;
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(@Valid @RequestBody @NonNull ProjectRequestDTO projectDTO) {

        var project = projectMapper.toEntity(projectDTO);

        var nonNullProject = Objects.requireNonNull(project, "A entidade Projeto não pode ser nula após o mapeamento.");

        var createdProject = projectService.createProject(nonNullProject);

        var responseDTO = projectMapper.toResponseDTO(createdProject);

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjects() {

        var projects = projectService.findAllProjects();

        var responseDTOs = projects.stream()
                .map(projectMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable @NonNull Long id) {

        var project = projectService.findProjectById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado com ID: " + id));

        var responseDTO = projectMapper.toResponseDTO(project);

        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable @NonNull Long id,
            @Valid @RequestBody ProjectRequestDTO projectDTO) {

        var projectDetails = projectMapper.toEntity(projectDTO);

        var updatedProject = projectService.updateProject(id, projectDetails);

        var responseDTO = projectMapper.toResponseDTO(updatedProject);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable @NonNull Long id) {

        projectService.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}