export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}
export interface MCPResult {
  content: string;
}
export interface ErrorResult {
  error: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
  streamingMessage?: string;
}
export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}
// Synapse Project Types
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
}