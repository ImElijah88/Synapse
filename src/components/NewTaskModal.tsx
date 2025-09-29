import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTask } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
const taskSchema = z.object({
  name: z.string().min(3, 'Task name must be at least 3 characters long.'),
});
type TaskFormData = z.infer<typeof taskSchema>;
interface NewTaskModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTaskCreated: () => void;
}
export function NewTaskModal({ isOpen, onOpenChange, onTaskCreated }: NewTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });
  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      await createTask(data.name);
      toast.success('Task created successfully!', {
        description: `"${data.name}" has been submitted to the workforce.`,
      });
      onTaskCreated();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error('Failed to create task.', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Submit a new high-level goal for the AI workforce to execute.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Task Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Generate Q4 Sales Report"
                className="col-span-3"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="col-span-4 text-right text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}