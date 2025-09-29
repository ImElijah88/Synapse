import { Task } from '@/types';
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result.data;
};
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks');
  return handleResponse<Task[]>(response);
};
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  const response = await fetch(`/api/tasks/${id}`);
  return handleResponse<Task | undefined>(response);
};
export const getEscalatedTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks?status=Escalated');
  return handleResponse<Task[]>(response);
};
export const submitEscalationFeedback = async (taskId: string, feedback: string): Promise<Task> => {
  const response = await fetch(`/api/tasks/${taskId}/escalate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedback }),
  });
  return handleResponse<Task>(response);
};
export const createTask = async (name: string): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  return handleResponse<Task>(response);
};