package com.taskflow.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskflow.backend.dto.AuthenticationRequestDTO;
import com.taskflow.backend.dto.AuthenticationResponseDTO;
import com.taskflow.backend.dto.RegisterRequestDTO;
import com.taskflow.backend.model.User;
import com.taskflow.backend.model.UserRole;
import com.taskflow.backend.repository.UserRepository;
import com.taskflow.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponseDTO register(RegisterRequestDTO request) {
        // Verifica se o usuário já existe (Regra de negócio)
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado.");
        }

        var user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // A senha deve ser sempre codificada!
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER); // Define a role padrão

        repository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponseDTO(jwtToken);
    }

    public AuthenticationResponseDTO authenticate(AuthenticationRequestDTO request) {
        // Tenta autenticar o usuário
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        // Se a autenticação for bem-sucedida, busca o usuário e gera o token
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas."));

        var jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponseDTO(jwtToken);
    }
}