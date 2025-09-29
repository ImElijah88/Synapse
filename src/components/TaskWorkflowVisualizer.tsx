import { WorkflowStep, AgentName } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Bot,
  User,
  Cpu,
  Server,
  ShieldCheck,
  Search,
  FileText,
  ChevronRight,
} from 'lucide-react';
const agentIcons: { [key in AgentName]: React.ElementType } = {
  Interpreter: FileText,
  Assistant: User,
  MCP: Server,
  Manager: Cpu,
  Worker: Bot,
  Operative: Bot,
  QC: ShieldCheck,
  Human: User,
};
const stepStatusStyles = {
  Completed: 'border-green-500 bg-green-500/10 text-green-500',
  'In Progress': 'border-blue-500 bg-blue-500/10 text-blue-500 animate-pulse',
  Failed: 'border-red-500 bg-red-500/10 text-red-500',
  Pending: 'border-gray-300 bg-gray-500/10 text-gray-500 dark:border-gray-700',
};
interface TaskWorkflowVisualizerProps {
  steps: WorkflowStep[];
}
export function TaskWorkflowVisualizer({ steps }: TaskWorkflowVisualizerProps) {
  return (
    <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto p-4">
      {steps.map((step, index) => {
        const Icon = agentIcons[step.agent];
        return (
          <motion.div
            key={step.id}
            className="flex items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={cn('flex flex-col items-center p-4 border-2 rounded-lg w-48 h-48 justify-center text-center transition-all duration-300', stepStatusStyles[step.status])}>
              <Icon className="h-8 w-8 mb-2" />
              <h3 className="font-bold text-sm">{step.agent}</h3>
              <p className="text-xs mt-1">{step.details}</p>
              {step.duration && <p className="text-xs mt-2 font-mono">({step.duration})</p>}
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-2 md:mx-4 shrink-0" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}