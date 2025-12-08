package com.taskflow.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.backend.dto.ViaCepResponseDTO;
import com.taskflow.backend.service.CepService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/cep")
@RequiredArgsConstructor
public class CepController {

    private final CepService cepService;

    @GetMapping("/search/{cep}")
    public Mono<ResponseEntity<ViaCepResponseDTO>> searchCep(@PathVariable String cep) {
        return cepService.searchCep(cep)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build()); // Retorna 404 se não encontrar
    }
}