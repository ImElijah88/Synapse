import { useEffect, useState } from 'react';
import { getEscalatedTasks, submitEscalationFeedback } from '@/lib/api';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
export function EscalationsPage() {
  const [escalatedTasks, setEscalatedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    getEscalatedTasks().then(setEscalatedTasks);
  }, []);
  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !feedback.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitEscalationFeedback(selectedTask.id, feedback);
      toast.success(`Feedback for task ${selectedTask.id} submitted!`, {
        description: 'The Manager Agent will now attempt a final, human-guided run.',
      });
      setFeedback('');
      setSelectedTask(null);
      setEscalatedTasks(tasks => tasks.filter(t => t.id !== selectedTask.id));
    } catch (error) {
      toast.error('Failed to submit feedback.', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Escalations</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Tasks requiring human intervention and feedback.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-semibold">Inbox ({escalatedTasks.length})</h2>
          {escalatedTasks.length > 0 ? (
            escalatedTasks.map(task => (
              <Card
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedTask?.id === task.id ? 'border-indigo-500 ring-2 ring-indigo-500' : ''}`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <CardDescription>{task.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Failed at QC on {format(parseISO(task.lastUpdatedAt), 'PP')}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500">No tasks currently require escalation.</p>
          )}
        </div>
        <div className="lg:col-span-2">
          {selectedTask ? (
            <Card>
              <form onSubmit={handleResubmit}>
                <CardHeader>
                  <CardTitle className="text-2xl">Review: {selectedTask.name}</CardTitle>
                  <CardDescription>Provide corrective feedback for the Manager Agent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300">QC Feedback</h4>
                        <p className="text-sm text-red-700 dark:text-red-400">{selectedTask.qcNotes || 'No QC notes available.'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback" className="text-lg font-semibold">Your Corrective Input</Label>
                    <Textarea
                      id="feedback"
                      placeholder="e.g., 'Ensure you cross-reference the APAC sales database (ref: #APAC-DB-2024) for Q3 figures. The schema has recently been updated.'"
                      rows={6}
                      required
                      className="text-base"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Submitting...' : 'Resubmit to Manager'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 border-2 border-dashed rounded-lg text-gray-500">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg">Select a task from the inbox to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}