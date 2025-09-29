import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, User } from 'lucide-react';
import { NewTaskModal } from './NewTaskModal';
import { useTasks } from '@/hooks/use-tasks';
const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/tasks/')) return 'Task Detail';
  if (pathname === '/tasks') return 'Tasks';
  if (pathname === '/escalations') return 'Escalations';
  if (pathname === '/settings') return 'Settings';
  return 'Synapse Command';
};
export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { refreshTasks } = useTasks();
  const title = getPageTitle(location.pathname);
  const description = {
    Dashboard: "High-level overview of the AI workforce's performance.",
    Tasks: "A comprehensive view of all tasks in the system.",
    'Task Detail': "An in-depth view of a single task.",
    Escalations: "Tasks requiring human intervention and feedback.",
    Settings: "Manage your account, integrations, and preferences.",
  }[title] || "Manage your AI workforce.";
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-transform"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            New Task
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>
        </div>
      </header>
      <NewTaskModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onTaskCreated={refreshTasks}
      />
    </>
  );
}