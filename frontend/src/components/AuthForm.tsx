import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../hooks/useAuth";
import type {
  AuthRequest,
  AuthResponse,
  AxiosErrorResponse,
  RegisterRequest,
} from "../types";
// Certifique-se de que AxiosErrorResponse está aqui

interface AuthFormProps {
  isLogin: boolean;
}

// Type Guard para erros do Axios
function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return !!error && typeof error === "object" && "response" in error;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/auth/authenticate" : "/auth/register";
    let payload: AuthRequest | RegisterRequest;

    if (isLogin) {
      payload = { email, password };
    } else {
      if (!name || !email || !password) {
        setError("Todos os campos são obrigatórios.");
        setLoading(false);
        return;
      }
      payload = { name, email, password };
    }

    try {
      const response = await api.post<AuthResponse>(endpoint, payload);
      const jwtToken = response.data.token;
      login(jwtToken);
    } catch (err: unknown) {
      let errorMessage = "Erro desconhecido. Tente novamente.";

      if (isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          "Erro ao comunicar com o servidor. Verifique as credenciais.";
      }

      console.error("Falha na autenticação:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div>
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="name"
          >
            Nome
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label
          className="block text-gray-700 text-sm font-semibold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-semibold mb-2"
          htmlFor="password"
        >
          Senha
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm italic">{error}</p>}

      <div className="flex items-center justify-between pt-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150"
          type="submit"
          disabled={loading}
        >
          {loading ? "Processando..." : isLogin ? "Entrar" : "Registrar"}
        </button>
        <Link
          to={isLogin ? "/register" : "/login"}
          className="inline-block align-baseline font-semibold text-sm text-gray-500 hover:text-blue-600 transition duration-150"
        >
          {isLogin ? "Criar uma conta" : "Já tenho conta"}
        </Link>
      </div>
    </form>
  );
};

export default AuthForm;
