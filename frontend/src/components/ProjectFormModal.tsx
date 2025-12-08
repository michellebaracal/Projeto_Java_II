import React, { useState } from "react";
import api from "../api/api";
import {
  ProjectStatusOptions,
  type IProject,
  type ProjectRequestDTO,
} from "../types";

interface ProjectFormModalProps {
  project: IProject | null;
  onClose: () => void;
  onSave: (data: ProjectRequestDTO) => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  project,
  onClose,
  onSave,
}) => {
  const isEditing = !!project;

  const initialData: ProjectRequestDTO = {
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "TO_DO",
    startDate: project?.startDate
      ? new Date(project.startDate).toISOString().substring(0, 10)
      : "",
    endDate: project?.endDate
      ? new Date(project.endDate).toISOString().substring(0, 10)
      : "",
    cep: project?.cep || "",
    logradouro: project?.logradouro || "",
    bairro: project?.bairro || "",
    cidade: project?.cidade || "",
    uf: project?.uf || "",
    numero: project?.numero || "",
  };

  const [formData, setFormData] = useState<ProjectRequestDTO>(initialData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCepSearch = async () => {
    const { cep } = formData;
    if (!cep || cep.length !== 8) {
      return;
    }

    try {
      const response = await api.get(`/cep/search/${cep}`);
      const data = response.data;

      if (data.erro) {
        alert("CEP não encontrado.");
      } else {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        }));
        document.getElementById("numero")?.focus();
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate) {
      alert("Título e Data de Início são obrigatórios.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Editar Projeto" : "Criar Novo Projeto"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Título */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="title"
            >
              Título
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Descrição
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
              disabled={!isEditing}
            >
              {ProjectStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Datas */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="startDate"
              >
                Data de Início
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="endDate"
              >
                Data Fim (Prev.)
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
          </div>

          {/* --- SEÇÃO DE ENDEREÇO --- */}
          <div className="mb-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-600 mb-3">Endereço</h3>

            {/* CEP */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="cep"
              >
                CEP
              </label>
              <input
                type="text"
                name="cep"
                id="cep"
                value={formData.cep || ""}
                onChange={handleChange}
                onBlur={handleCepSearch}
                maxLength={8}
                placeholder="00000000"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>

            {/* Logradouro e Número */}
            <div className="flex gap-4 mb-4">
              <div className="w-3/4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="logradouro"
                >
                  Logradouro
                </label>
                <input
                  type="text"
                  name="logradouro"
                  id="logradouro"
                  value={formData.logradouro || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50"
                />
              </div>
              <div className="w-1/4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="numero"
                >
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  id="numero"
                  value={formData.numero || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required // Campo Obrigatório
                />
              </div>
            </div>

            {/* Bairro, Cidade, UF */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="bairro"
                >
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  id="bairro"
                  value={formData.bairro || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="cidade"
                >
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  id="cidade"
                  value={formData.cidade || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="uf"
                >
                  UF
                </label>
                <input
                  type="text"
                  name="uf"
                  id="uf"
                  value={formData.uf || ""}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {isEditing ? "Salvar Alterações" : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
