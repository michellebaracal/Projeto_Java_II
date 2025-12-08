package com.taskflow.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.taskflow.backend.dto.ViaCepResponseDTO;

import reactor.core.publisher.Mono;

@Service
public class CepService {

    private static final String VIACEP_URL = "https://viacep.com.br/ws/";
    private final WebClient webClient;

    public CepService(WebClient webClient) {
        this.webClient = webClient.mutate().baseUrl(VIACEP_URL).build();
    }

    public Mono<ViaCepResponseDTO> searchCep(String cep) {
        if (cep == null || cep.length() != 8) {
            return Mono.empty();
        }

        String cleanCep = cep.replaceAll("\\D", "");

        return webClient.get()
                .uri("/{cep}/json", cleanCep)
                .retrieve()
                .bodyToMono(ViaCepResponseDTO.class)
                .onErrorResume(e -> {
                    System.err.println("Erro ao buscar CEP: " + e.getMessage());
                    return Mono.empty();
                });
    }
}