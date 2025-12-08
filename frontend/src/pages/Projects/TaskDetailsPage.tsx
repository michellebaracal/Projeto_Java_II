import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import TaskFormModal from "../../components/TaskFormModal";
import { useAuth } from "../../hooks/useAuth";
import type { IProject, ITask, TaskRequestDTO } from "../../types";

const TaskDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [project, setProject] = useState<IProject | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projId = projectId ? parseInt(projectId, 10) : undefined;
  const taskApiUrl = projId ? `/projects/${projId}/tasks` : "";

  const fetchTasks = async () => {
    if (!projId) return;
    setLoading(true);
    try {
      const projectResponse = await api.get<IProject>(`/projects/${projId}`);
      setProject(projectResponse.data);

      const tasksResponse = await api.get<ITask[]>(taskApiUrl);
      setTasks(tasksResponse.data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status) {
        switch (err.response.status) {
          case 401:
            alert("Sessão expirada. Faça login novamente.");
            logout();
            break;
          case 404:
            alert("Projeto não encontrado.");
            navigate("/projects");
            break;
          case 403:
            setError("Você não tem permissão para acessar este projeto.");
            break;
          default:
            setError(`Erro do servidor (${err.response.status}).`);
        }
      } else {
        setError("Falha na comunicação com a API. Verifique sua conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveTask = async (taskData: TaskRequestDTO) => {
    if (!projId) return;
    try {
      if (editingTask) {
        await api.put(`${taskApiUrl}/${editingTask.id}`, taskData);
      } else {
        await api.post(taskApiUrl, taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err: unknown) {
      setError("Erro ao salvar a tarefa." + err);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!projId || !window.confirm("Excluir esta tarefa?")) return;
    try {
      await api.delete(`${taskApiUrl}/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err: unknown) {
      setError("Falha ao excluir a tarefa." + err);
    }
  };
  // Função para corrigir o problema de fuso horário
  const formatTaskDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("pt-BR");
  };
  const toggleTaskStatus = async (task: ITask) => {
    try {
      const newStatus = task.status === "DONE" ? "TO_DO" : "DONE";
      const taskPayload: TaskRequestDTO = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: newStatus,
      };
      await api.put(`${taskApiUrl}/${task.id}`, taskPayload);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Erro desconhecido";
        alert(`Erro ao salvar: ${message}`);
      } else {
        console.error("Erro genérico:", error);
        alert("Erro inesperado ao conectar com o servidor.");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  if (!projId) return <h1>ID de Projeto Inválido</h1>;
  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8">
      {/* --- CABEÇALHO DO PROJETO --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        {/* LADO ESQUERDO: Título e Status */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {project?.title || "Carregando..."}
          </h1>

          {/* Badge de Status do Projeto (Visual Novo) */}
          <div className="flex items-center">
            {project?.status && (
              <span
                className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm
                text-xs font-bold uppercase tracking-widest
                ${
                  project.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : project.status === "IN_PROGRESS"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : project.status === "ON_HOLD"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : project.status === "CANCELED"
                    ? "bg-gray-100 text-gray-500 border-gray-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }
              `}
              >
                {/* Bolinha Indicadora */}
                <span
                  className={`w-2 h-2 rounded-full ${
                    project.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : project.status === "IN_PROGRESS"
                      ? "bg-blue-500"
                      : project.status === "ON_HOLD"
                      ? "bg-amber-500"
                      : project.status === "CANCELED"
                      ? "bg-gray-400"
                      : "bg-slate-400"
                  }`}
                ></span>

                {/* Texto do Status */}
                {project.status === "IN_PROGRESS"
                  ? "Em Andamento"
                  : project.status === "ON_HOLD"
                  ? "Em Espera"
                  : project.status === "COMPLETED"
                  ? "Concluído"
                  : project.status === "CANCELED"
                  ? "Cancelado"
                  : "A Fazer"}
              </span>
            )}
          </div>
        </div>

        {/* LADO DIREITO: Botão (Agora alinhado à direita) */}
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        >
          <span className="text-xl leading-none font-bold">+</span> Nova Tarefa
        </button>
      </div>

      {/* --- FIM DO CABEÇALHO --- */}

      <h2 className="text-2xl font-semibold mb-4">Tarefas ({tasks.length})</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white border rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              task.status === "DONE" ? "opacity-75 bg-gray-50" : ""
            } ${
              task.status === "BLOCKED"
                ? "border-red-200 bg-red-50"
                : task.status === "ON_HOLD"
                ? "border-amber-200 bg-amber-50 border-dashed"
                : "border-gray-100"
            }`}
          >
            {/* --- COLUNA DA ESQUERDA --- */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                {/* Título */}
                <h4
                  className={`text-lg font-bold ${
                    task.status === "DONE" || task.status === "CANCELED"
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h4>
              </div>

              <p className="text-gray-500 text-sm mb-3">
                {task.description || "Sem descrição adicional."}
              </p>

              {/* Linha de Detalhes */}
              <div className="flex items-center gap-6 text-sm">
                {/* Data */}
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span>📅</span>
                  <span
                    className={`font-medium ${
                      new Date(task.dueDate) < new Date() &&
                      task.status !== "DONE" &&
                      task.status !== "CANCELED"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {formatTaskDate(task.dueDate)}
                  </span>
                </div>

                {/* Prioridade */}
                <div className="flex items-center gap-1.5">
                  {/* <span>🔥</span> */}
                  <span
                    className={`font-bold text-xs px-2 py-1 rounded border ${
                      task.priority === "URGENT"
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : task.priority === "HIGH"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : task.priority === "MEDIUM"
                        ? "bg-orange-50 text-orange-600 border-orange-100"
                        : "bg-green-50 text-green-600 border-green-100"
                    }`}
                  >
                    {task.priority === "URGENT"
                      ? "Urgente"
                      : task.priority === "HIGH"
                      ? "Alta"
                      : task.priority === "MEDIUM"
                      ? "Média"
                      : "Baixa"}
                  </span>
                </div>
                {/* Badge de Status */}
                <span
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border shadow-sm
                    text-[10px] font-bold uppercase tracking-widest
                    transition-colors duration-200
                    ${
                      task.status === "DONE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : task.status === "BLOCKED"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : task.status === "ON_HOLD"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : task.status === "CANCELED"
                        ? "bg-gray-100 text-gray-500 border-gray-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }
                  `}
                >
                  {/* Bolinha Colorida */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      task.status === "DONE"
                        ? "bg-emerald-500"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-500"
                        : task.status === "BLOCKED"
                        ? "bg-red-500"
                        : task.status === "ON_HOLD"
                        ? "bg-amber-500"
                        : task.status === "CANCELED"
                        ? "bg-gray-400"
                        : "bg-slate-400"
                    }`}
                  ></span>

                  {/* Texto */}
                  {task.status === "TO_DO"
                    ? "A Fazer"
                    : task.status === "IN_PROGRESS"
                    ? "Em Andamento"
                    : task.status === "BLOCKED"
                    ? "Bloqueada"
                    : task.status === "ON_HOLD"
                    ? "Em Espera"
                    : task.status === "DONE"
                    ? "Concluída"
                    : "Cancelada"}
                </span>
              </div>
            </div>

            {/* --- COLUNA DA DIREITA (Ações) --- */}
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              {/* Botão Concluir */}
              {task.status !== "DONE" && task.status !== "CANCELED" && (
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium text-sm transition-colors border border-green-100"
                >
                  ✅ Concluir
                </button>
              )}

              {/* Botão Editar */}
              <button
                onClick={() => {
                  setEditingTask(task);
                  setIsModalOpen(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                title="Editar"
              >
                ✏️
              </button>

              {/* Botão Excluir */}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskFormModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={saveTask}
        />
      )}
    </div>
  );
};

export default TaskDetailsPage;
