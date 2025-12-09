export interface IProject {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "ON_HOLD";
  startDate: string;
  endDate: string;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  numero?: string;
}

export interface AuthContextType {
  token: string | null;
  login: (jwt: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
}

export interface ProjectRequestDTO {
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED" | "CANCELED" | "ON_HOLD";
  startDate: string;
  endDate?: string;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  numero?: string;
}

export interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export interface ITask {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  status: "TO_DO" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELED" | "ON_HOLD";
  projectId: number;
}

export interface TaskRequestDTO {
  title: string;
  description?: string;
  dueDate: string;
  priority: ITask["priority"];
  status: ITask["status"];
}

export const TaskPriorityOptions = [
  { value: "URGENT", label: "Urgente" },
  { value: "HIGH", label: "Alta" },
  { value: "MEDIUM", label: "Média" },
  { value: "LOW", label: "Baixa" },
];
export const TaskStatusOptions = [
  { value: "TO_DO", label: "A Fazer" },
  { value: "IN_PROGRESS", label: "Em Progresso" },
  { value: "BLOCKED", label: "Bloqueada" },
  { value: "DONE", label: "Concluída" },
  { value: "CANCELED", label: "Cancelada" },
];
export const ProjectStatusOptions = [
  { value: "TO_DO", label: "A Fazer" },
  { value: "IN_PROGRESS", label: "Em Progresso" },
  { value: "ON_HOLD", label: "Em Espera" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELED", label: "Cancelado" },
];
