import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task, TaskStatus } from '@/types';
import { format, parseISO } from 'date-fns';
import { ListFilter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/use-tasks';
import { Skeleton } from '@/components/ui/skeleton';
const statusStyles: { [key in TaskStatus]: string } = {
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 animate-pulse',
  Failed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300',
  Escalated: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Resubmitted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
};
export function TasksPage() {
  const { tasks, loading } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<Record<TaskStatus, boolean>>({
    Completed: true,
    'In Progress': true,
    Failed: true,
    Pending: true,
    Escalated: true,
    Resubmitted: true,
  });
  const navigate = useNavigate();
  useEffect(() => {
    let result = tasks;
    if (searchTerm) {
      result = result.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const activeFilters = Object.entries(statusFilters)
      .filter(([, value]) => value)
      .map(([key]) => key as TaskStatus);
    result = result.filter(task => activeFilters.includes(task.status));
    setFilteredTasks(result);
  }, [searchTerm, statusFilters, tasks]);
  const handleStatusFilterChange = (status: TaskStatus) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(statusFilters).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilters[status as TaskStatus]}
                onCheckedChange={() => handleStatusFilterChange(status as TaskStatus)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Task ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Submitted At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                </TableRow>
              ))
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-500">{task.id}</TableCell>
                  <TableCell>
                    <Badge className={cn('font-semibold', statusStyles[task.status])}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>{format(parseISO(task.lastUpdatedAt), 'PPp')}</TableCell>
                  <TableCell>{format(parseISO(task.submittedAt), 'PPp')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}