import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTaskById } from '@/lib/api';
import { Task, TaskStatus } from '@/types';
import { TaskWorkflowVisualizer } from '@/components/TaskWorkflowVisualizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
const statusStyles: { [key in TaskStatus]: string } = {
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Failed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300',
  Escalated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Resubmitted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
};
export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (id) {
      setLoading(true);
      getTaskById(id).then(data => {
        setTask(data || null);
        setLoading(false);
      });
    }
  }, [id]);
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-6 w-40" />
        <header className="space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-48" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-48" /></CardContent></Card>
        </div>
        <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }
  if (!task) {
    return <div className="p-12 text-center">Task not found.</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/tasks" className="flex items-center gap-2 text-indigo-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>
      <header>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{task.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1 font-mono">{task.id}</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent><Badge className={cn('text-lg', statusStyles[task.status])}>{task.status}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Submitted At</CardTitle></CardHeader>
          <CardContent><p>{format(parseISO(task.submittedAt), 'PPpp')}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Last Updated</CardTitle></CardHeader>
          <CardContent><p>{format(parseISO(task.lastUpdatedAt), 'PPpp')}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Workflow Visualizer</CardTitle></CardHeader>
        <CardContent>
          <TaskWorkflowVisualizer steps={task.workflow} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-white font-mono text-sm p-4 rounded-lg max-h-96 overflow-y-auto">
            {task.logs.map((log, i) => (
              <p key={i} className="whitespace-pre-wrap">&gt; {log}</p>
            ))}
             {task.logs.length === 0 && <p>&gt; No logs available.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}