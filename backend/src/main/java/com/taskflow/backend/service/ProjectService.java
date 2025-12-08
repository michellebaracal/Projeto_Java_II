package com.taskflow.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.taskflow.backend.model.Project;
import com.taskflow.backend.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(@NonNull Project project) {
        return projectRepository.save(project);
    }

    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> findProjectById(@NonNull Long id) {
        return projectRepository.findById(id);
    }

    public Project updateProject(@NonNull Long id, Project updatedProject) {
        return projectRepository.findById(id)
                .map(project -> {

                    project.setTitle(updatedProject.getTitle());
                    project.setDescription(updatedProject.getDescription());
                    project.setStatus(updatedProject.getStatus());

                    project.setStartDate(updatedProject.getStartDate());
                    project.setEndDate(updatedProject.getEndDate());

                    project.setCep(updatedProject.getCep());
                    project.setLogradouro(updatedProject.getLogradouro());
                    project.setBairro(updatedProject.getBairro());
                    project.setCidade(updatedProject.getCidade());
                    project.setUf(updatedProject.getUf());
                    project.setNumero(updatedProject.getNumero());

                    return projectRepository.save(project);
                })
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado com o ID: " + id));
    }

    public void deleteProject(@NonNull Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Projeto não encontrado com o ID: " + id);
        }
        projectRepository.deleteById(id);
    }
}