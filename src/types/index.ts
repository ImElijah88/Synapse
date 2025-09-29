export type AgentName =
  | 'Interpreter'
  | 'Assistant'
  | 'MCP'
  | 'Manager'
  | 'Worker'
  | 'Operative'
  | 'QC'
  | 'Human';
export type TaskStatus = 'Completed' | 'In Progress' | 'Failed' | 'Pending' | 'Escalated' | 'Resubmitted';
export interface Agent {
  name: AgentName;
  description: string;
}
export interface WorkflowStep {
  id: string;
  agent: AgentName;
  status: 'Completed' | 'In Progress' | 'Failed' | 'Pending';
  timestamp: string;
  duration?: string;
  details: string;
  logs?: string[];
}
export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  submittedAt: string;
  lastUpdatedAt: string;
  successRate: number;
  currentStep: number;
  workflow: WorkflowStep[];
  logs: string[];
  failureReason?: string;
}