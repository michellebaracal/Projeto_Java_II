package com.taskflow.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.taskflow.backend.dto.ProjectRequestDTO;
import com.taskflow.backend.dto.ProjectResponseDTO;
import com.taskflow.backend.model.Project;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = { TaskMapper.class })
public interface ProjectMapper {
    Project toEntity(ProjectRequestDTO dto);

    ProjectResponseDTO toResponseDTO(Project entity);
}