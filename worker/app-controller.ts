import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, Task, TaskStatus, AgentName, WorkflowStep } from './types';
import type { Env } from './core-utils';
const generateId = (prefix: 'tsk' | 'stp') => `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
const mockWorkflowSteps: (status: TaskStatus) => WorkflowStep[] = (taskStatus) => {
  const steps: { agent: AgentName; details: string }[] = [
    { agent: 'Interpreter', details: 'Parsing and structuring client request.' },
    { agent: 'Assistant', details: 'Requesting human supervision via Telegram.' },
    { agent: 'MCP', details: 'Task approved and routed to Manager.' },
    { agent: 'Manager', details: 'Devising plan and training Worker Agent.' },
    { agent: 'Worker', details: 'Executing mission and depositing result.' },
    { agent: 'Operative', details: 'Moving result to Quality Control.' },
    { agent: 'QC', details: 'Performing automated quality checks.' },
  ];
  let currentStepIndex = 4; // Default 'In Progress' at Worker
  if (taskStatus === 'Completed') currentStepIndex = steps.length;
  if (taskStatus === 'Failed' || taskStatus === 'Escalated') currentStepIndex = 6;
  if (taskStatus === 'Pending' || taskStatus === 'Resubmitted') currentStepIndex = 1;
  return steps.map((step, index) => {
    let status: WorkflowStep['status'] = 'Pending';
    if (index < currentStepIndex) {
      status = 'Completed';
    } else if (index === currentStepIndex) {
      status = 'In Progress';
    }
    if ((taskStatus === 'Failed' || taskStatus === 'Escalated') && index === 6) status = 'Failed';
    return {
      id: generateId('stp'),
      agent: step.agent,
      status: status,
      timestamp: new Date(Date.now() - (steps.length - index) * 60000).toISOString(),
      duration: index < currentStepIndex ? `${Math.floor(Math.random() * 50) + 10}s` : undefined,
      details: step.details,
      logs: status !== 'Pending' ? [`Log entry A for ${step.agent}`, `Log entry B for ${step.agent}`] : [],
    };
  });
};
const mockTasks: Task[] = [
  {
    id: 'tsk-001', name: 'Generate Q3 Financial Report', status: 'Completed',
    submittedAt: new Date('2024-09-15T10:00:00Z').toISOString(), lastUpdatedAt: new Date('2024-09-15T10:45:00Z').toISOString(),
    successRate: 100, currentStep: 7, workflow: mockWorkflowSteps('Completed'), logs: ['Task initiated', 'Report generated successfully'],
  },
  {
    id: 'tsk-002', name: 'Onboard New Client: Acme Corp', status: 'In Progress',
    submittedAt: new Date('2024-09-16T11:30:00Z').toISOString(), lastUpdatedAt: new Date().toISOString(),
    successRate: 95, currentStep: 4, workflow: mockWorkflowSteps('In Progress'), logs: ['Onboarding process started'],
  },
  {
    id: 'tsk-003', name: 'Deploy Staging Server Updates', status: 'Failed',
    submittedAt: new Date('2024-09-16T09:00:00Z').toISOString(), lastUpdatedAt: new Date('2024-09-16T09:25:00Z').toISOString(),
    successRate: 0, currentStep: 6, workflow: mockWorkflowSteps('Failed'), logs: ['Deployment failed: dependency conflict'],
  },
  {
    id: 'tsk-004', name: 'Analyze Competitor Website SEO', status: 'Escalated',
    submittedAt: new Date('2024-09-14T14:00:00Z').toISOString(), lastUpdatedAt: new Date('2024-09-14T15:10:00Z').toISOString(),
    successRate: 50, currentStep: 6, workflow: mockWorkflowSteps('Escalated'), logs: ['QC failed, requires human review'],
    failureReason: 'Automated analysis inconclusive. Requires human review for nuanced interpretation.',
  },
  {
    id: 'tsk-005', name: 'Draft Marketing Email Campaign', status: 'Pending',
    submittedAt: new Date().toISOString(), lastUpdatedAt: new Date().toISOString(),
    successRate: 100, currentStep: 1, workflow: mockWorkflowSteps('Pending'), logs: ['Awaiting approval'],
  },
];
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private tasks = new Map<string, Task>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const storedSessions = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      this.sessions = new Map(Object.entries(storedSessions));
      const storedTasks = await this.ctx.storage.get<Record<string, Task>>('tasks');
      if (storedTasks && Object.keys(storedTasks).length > 0) {
        this.tasks = new Map(Object.entries(storedTasks));
      } else {
        mockTasks.forEach(task => this.tasks.set(task.id, task));
        await this.persistTasks();
      }
      this.loaded = true;
    }
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  private async persistTasks(): Promise<void> {
    await this.ctx.storage.put('tasks', Object.fromEntries(this.tasks));
  }
  // Session Management
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, { id: sessionId, title: title || `Chat ${new Date(now).toLocaleDateString()}`, createdAt: now, lastActive: now });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persistSessions();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persistSessions();
    return count;
  }
  // Task Management
  async getTasks(status?: TaskStatus): Promise<Task[]> {
    await this.ensureLoaded();
    const allTasks = Array.from(this.tasks.values());
    const filteredTasks = status ? allTasks.filter((task) => task.status === status) : allTasks;
    return filteredTasks.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
  }
  async getTaskById(id: string): Promise<Task | undefined> {
    await this.ensureLoaded();
    return this.tasks.get(id);
  }
  async updateTask(task: Task): Promise<void> {
    await this.ensureLoaded();
    this.tasks.set(task.id, task);
    await this.persistTasks();
  }
  async createTask(name: string): Promise<Task> {
    await this.ensureLoaded();
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId('tsk'),
      name,
      status: 'Pending',
      submittedAt: now,
      lastUpdatedAt: now,
      successRate: 0,
      currentStep: 0,
      workflow: mockWorkflowSteps('Pending'),
      logs: [`Task "${name}" created and is pending approval.`],
    };
    this.tasks.set(newTask.id, newTask);
    await this.persistTasks();
    return newTask;
  }
}