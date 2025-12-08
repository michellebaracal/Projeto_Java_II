package com.taskflow.backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.taskflow.backend.dto.TaskRequestDTO;
import com.taskflow.backend.dto.TaskResponseDTO;
import com.taskflow.backend.model.Task;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TaskMapper {

    Task toEntity(TaskRequestDTO dto);

    @Mapping(target = "projectId", source = "project.id")
    TaskResponseDTO toResponseDTO(Task entity);

    List<TaskResponseDTO> toResponseDTO(List<Task> entities);
}