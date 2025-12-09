import React, { useState } from "react";
import {
  TaskPriorityOptions,
  TaskStatusOptions,
  type ITask,
  type TaskRequestDTO,
} from "../types";

interface TaskFormModalProps {
  task: ITask | null; // Tarefa para edição ou null para criação
  onClose: () => void;
  onSave: (data: TaskRequestDTO) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  task,
  onClose,
  onSave,
}) => {
  const isEditing = !!task;

  const initialData: TaskRequestDTO = {
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "MEDIUM",
    status: task?.status || "TO_DO",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().substring(0, 10)
      : "",
  };

  const [formData, setFormData] = useState<TaskRequestDTO>(initialData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      alert("Título e Data de Vencimento são obrigatórios.");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Editar Tarefa" : "Criar Nova Tarefa"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Título */}
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
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          {/* Campo Descrição */}
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
              className="shadow border rounded w-full py-2 px-3"
            />
          </div>

          {/* Campo Prioridade (Dropdown) */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="priority"
            >
              Prioridade
            </label>
            <select
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3"
              required
            >
              {TaskPriorityOptions.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Status (Dropdown) */}
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
              className="shadow border rounded w-full py-2 px-3"
              required
            >
              {TaskStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Data de Vencimento */}
          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="dueDate"
            >
              Data de Vencimento
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3"
              required
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {isEditing ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
