# 🚀 TaskFlow: Gerenciador de Tarefas Colaborativas

Este é o repositório do projeto **TaskFlow**, um sistema web completo desenvolvido com **Arquitetura em Camadas** utilizando **Spring Boot** (Backend) e **React** (Frontend).

## 💡 Visão Geral do Projeto

O **TaskFlow** é uma aplicação para gerenciamento colaborativo de projetos e tarefas. Ele permite o cadastro e autenticação de usuários e a execução de operações CRUD completas sobre projetos e tarefas, com um foco na separação de responsabilidades e na segurança.

---

## ⚙️ Arquitetura e Tecnologias

O projeto segue rigorosamente a arquitetura em camadas e utiliza um _stack_ moderno:

### 1\. Backend (API RESTful)

- **Framework:** **Spring Boot** (Java 17+).
- **Arquitetura:** **Camadas (Layered)**: `Controller` (Apresentação), `Service` (Negócio), `Repository` (Persistência).

- **Persistência:** **JPA/Hibernate** com Banco de Dados **PostgreSQL**.
- **Segurança:** Autenticação e Autorização baseadas em **JWT** (JSON Web Tokens) usando Spring Security.
- **Mapeamento:** **MapStruct** para conversão eficiente de Entidade ↔ DTO.
- **API Externa:** Integração com a API **ViaCEP** para enriquecimento de dados (busca de endereço).

### 2\. Frontend (SPA)

- **Framework:** **React** (com TypeScript).
- **Roteamento:** **React Router DOM** com proteção de rotas (Private Routes) baseada em JWT.
- **Comunicação:** **Axios** (cliente HTTP) configurado para enviar o JWT em todas as requisições.

### 3\. Modelo de Dados Principal

O sistema implementa um relacionamento **1 para N** entre as entidades principais:

| Entidade                | Relacionamento                           |
| :---------------------- | :--------------------------------------- |
| **`Project` (Projeto)** | **1** Projeto tem **N** Tarefas.         |
| **`Task` (Tarefa)**     | **N** Tarefas pertencem a **1** Projeto. |

---

## 🛠️ Instruções de Setup e Execução

Para iniciar o projeto, você precisará ter **Docker**, **Java 17+ (ou superior)** e **Maven** instalados.

### 1\. Configuração do Banco de Dados (PostgreSQL via Docker)

O banco de dados é inicializado via Docker Compose, garantindo um ambiente isolado e pronto para uso.

1.  Navegue até a pasta `backend/`.

2.  Execute o comando para subir o container do PostgreSQL:

    ```bash
    docker compose up -d
    ```

### 2\. Execução do Backend (Spring Boot API)

1.  Na pasta `backend/`, compile e execute o projeto usando o Maven. O argumento `-DskipTests` é usado para pular a fase de testes, que pode exigir configuração adicional de ambiente.

    ```bash
    # Compila, empacota e instala dependências
    mvn clean install -DskipTests

    # Executa o JAR compilado
    java -jar target/backend-0.0.1-SNAPSHOT.jar
    ```

2.  A API REST estará rodando em: `http://localhost:8080`.

### 3\. Execução do Frontend (React)

1.  Abra um **novo terminal** e navegue até a pasta `taskflow-frontend/`.

2.  Instale as dependências Node:

    ```bash
    npm install
    ```

3.  Inicie a aplicação de desenvolvimento:

    ```bash
    npm start
    ```

4.  O Frontend estará acessível em: `http://localhost:5173`.

---

## 🌐 Documentação da API (Swagger)

A API REST está documentada automaticamente usando **SpringDoc OpenAPI**.

Para acessar a interface interativa e testar os endpoints:

- **URL:** `http://localhost:8080/swagger-ui.html`

Você encontrará documentação detalhada sobre os esquemas de dados (DTOs) e os caminhos de requisição para `POST /api/auth/register`, `/api/projects`, `/api/projects/{id}/tasks`, e o endpoint público de CEP.
