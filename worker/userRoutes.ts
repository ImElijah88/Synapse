import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Session Management Routes
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/sessions', async (c) => {
        const body = await c.req.json().catch(() => ({}));
        const { title, sessionId: providedSessionId, firstMessage } = body;
        const sessionId = providedSessionId || crypto.randomUUID();
        let sessionTitle = title;
        if (!sessionTitle) {
            const now = new Date();
            const dateTime = now.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            if (firstMessage && firstMessage.trim()) {
                const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ');
                const truncated = cleanMessage.length > 40 ? cleanMessage.slice(0, 37) + '...' : cleanMessage;
                sessionTitle = `${truncated} • ${dateTime}`;
            } else {
                sessionTitle = `Chat ${dateTime}`;
            }
        }
        await registerSession(c.env, sessionId, sessionTitle);
        return c.json({ success: true, data: { sessionId, title: sessionTitle } });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const deleted = await unregisterSession(c.env, sessionId);
        if (!deleted) return c.json({ success: false, error: 'Session not found' }, { status: 404 });
        return c.json({ success: true, data: { deleted: true } });
    });
    app.delete('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const deletedCount = await controller.clearAllSessions();
        return c.json({ success: true, data: { deletedCount } });
    });
    // Task Management Routes
    app.get('/api/tasks', async (c) => {
        const { status } = c.req.query();
        const controller = getAppController(c.env);
        const tasks = await controller.getTasks(status);
        return c.json({ success: true, data: tasks });
    });
    app.post('/api/tasks', async (c) => {
        const { name } = await c.req.json<{ name: string }>();
        if (!name || typeof name !== 'string' || name.trim().length < 3) {
            return c.json({ success: false, error: 'Valid task name is required' }, 400);
        }
        const controller = getAppController(c.env);
        const newTask = await controller.createTask(name.trim());
        return c.json({ success: true, data: newTask }, 201);
    });
    app.get('/api/tasks/:id', async (c) => {
        const { id } = c.req.param();
        const controller = getAppController(c.env);
        const task = await controller.getTaskById(id);
        if (!task) {
            return c.json({ success: false, error: 'Task not found' }, 404);
        }
        return c.json({ success: true, data: task });
    });
    app.post('/api/tasks/:id/escalate', async (c) => {
        const { id } = c.req.param();
        const { feedback } = await c.req.json<{ feedback: string }>();
        if (!feedback) {
            return c.json({ success: false, error: 'Feedback is required' }, 400);
        }
        const controller = getAppController(c.env);
        const task = await controller.getTaskById(id);
        if (!task) {
            return c.json({ success: false, error: 'Task not found' }, 404);
        }
        task.status = 'Resubmitted';
        task.lastUpdatedAt = new Date().toISOString();
        task.logs.push(`[Human Feedback]: ${feedback}`);
        task.logs.push('Task resubmitted to Manager Agent for final attempt.');
        await controller.updateTask(task);
        return c.json({ success: true, data: task });
    });
}