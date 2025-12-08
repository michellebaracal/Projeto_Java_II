import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import ProjectFormModal from "../../components/ProjectFormModal";
import { useAuth } from "../../hooks/useAuth";
import type {
  AxiosErrorResponse,
  IProject,
  ProjectRequestDTO,
} from "../../types";

const isAxiosError = (error: unknown): error is AxiosErrorResponse => {
  return !!error && typeof error === "object" && "response" in error;
};

const ProjectsDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<IProject[]>("/projects");
      setProjects(response.data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        logout();
      } else {
        setError("Falha ao carregar projetos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveProject = async (projectData: ProjectRequestDTO) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, projectData);
      } else {
        await api.post("/projects", projectData);
      }

      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err: unknown) {
      setError("Erro ao salvar o projeto. Verifique os dados." + err);
    }
  };

  const deleteProject = async (projectId: number) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este projeto e todas as suas tarefas?"
      )
    ) {
      try {
        await api.delete(`/projects/${projectId}`);
        setProjects(projects.filter((p) => p.id !== projectId));
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          logout();
        } else {
          setError("Falha ao excluir o projeto.");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xl text-gray-600">
        Carregando projetos...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        Seus Projetos Ativos
      </h1>

      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</div>
      )}

      <button
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 mb-8 font-semibold transition duration-150"
        onClick={() => {
          setEditingProject(null);
          setIsModalOpen(true);
        }}
      >
        + Novo Projeto
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 border rounded-2xl shadow-xl bg-white hover:shadow-2xl transition duration-300"
          >
            <h3 className="text-2xl font-bold mb-2 text-blue-700">
              {project.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {project.description || "Nenhuma descrição."}
            </p>
            {/* --- NOVO: BLOCO DE ENDEREÇO --- */}
            {/* Só exibe se houver pelo menos uma cidade ou rua cadastrada */}
            {(project.logradouro || project.cidade) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span role="img" aria-label="localização">
                    📍
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {project.cidade} - {project.uf}
                    </span>
                    {project.logradouro && (
                      <span>
                        {project.logradouro}, {project.numero || "S/N"}
                      </span>
                    )}
                    {project.bairro && (
                      <span className="text-xs text-gray-500">
                        {project.bairro}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* --- FIM DO BLOCO DE ENDEREÇO --- */}
            <div className="flex flex-col gap-8 mt-4 pt-4 border-t border-gray-100">
              {/* Linha do Status (Novo Design Unificado) */}
              <div className="flex justify-start mt-2 mb-4">
                <span
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border shadow-sm
                    text-[10px] font-bold uppercase tracking-widest
                    transition-colors duration-200
                    ${
                      project.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : project.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : project.status === "ON_HOLD"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : project.status === "CANCELED"
                        ? "bg-gray-100 text-gray-500 border-gray-200"
                        : "bg-slate-50 text-slate-600 border-slate-200" // TO_DO
                    }
                  `}
                >
                  {/* Bolinha Colorida */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
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

                  {/* Texto Traduzido */}
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
              </div>

              {/* Linha dos Botões de Ação */}
              <div className="flex items-center  gap-3">
                {/* Botão ABRIR (Agora com estilo de botão azul) */}
                <Link
                  to={`/projects/${project.id}/tasks`}
                  className="text-center bg-blue-600 hover:bg-blue-700 text-white visited:text-white font-medium py-2 px-6 text-sm rounded transition duration-150"
                >
                  Abrir
                </Link>

                {/* Botões Secundários (Editar/Excluir) */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer p-2 text-yellow-600 hover:bg-yellow-50 rounded transition duration-150 border border-yellow-200"
                    title="Editar"
                  >
                    {/* Ícone de lápis ou Texto "Editar" */}
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="cursor-pointer  p-2 text-red-600 hover:bg-red-50 rounded transition duration-150 border border-red-200"
                    title="Excluir"
                  >
                    {/* Ícone de lixeira ou Texto "Excluir" */}
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setIsModalOpen(false)}
          onSave={saveProject}
        />
      )}
    </div>
  );
};

export default ProjectsDashboard;
