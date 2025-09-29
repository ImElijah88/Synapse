import { useEffect } from 'react';
import { useTaskStore } from '@/store/task-store';
const POLLING_INTERVAL = 5000; // 5 seconds
export function useTasks() {
  const { tasks, loading, error, fetchTasks } = useTaskStore();
  useEffect(() => {
    fetchTasks(); // Initial fetch
    const intervalId = setInterval(fetchTasks, POLLING_INTERVAL);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchTasks]);
  return { tasks, loading, error, refreshTasks: fetchTasks };
}