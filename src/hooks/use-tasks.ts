import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { getTasks } from '@/lib/api';
const POLLING_INTERVAL = 5000; // 5 seconds
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks(); // Initial fetch
    const intervalId = setInterval(fetchTasks, POLLING_INTERVAL);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  return { tasks, loading, error, refreshTasks: fetchTasks };
}