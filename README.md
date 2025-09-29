# Synapse Command

A sophisticated command center to manage, monitor, and interact with the Project Synapse multi-agent AI workforce.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ImElijah88/Synapse)

Synapse Command is the sophisticated web-based graphical user interface for Project Synapse, an adaptive multi-agent AI workforce. It serves as an autonomous operational hub and command center, providing a visually stunning and intuitive platform for users to submit, monitor, and manage complex tasks. The application features a real-time dashboard with key performance metrics, a detailed task management view with advanced filtering, and a unique visual workflow editor that graphically represents each task's journey through the multi-agent system.

## Key Features

-   **Real-time Dashboard**: A high-level overview of the AI workforce's performance with key success metrics and a feed of recent task activities.
-   **Comprehensive Task Management**: A filterable and searchable view of all tasks, whether in-progress, completed, failed, or pending escalation.
-   **Workflow Visualizer**: An in-depth, graphical representation of a task's progression through the various agents, providing complete transparency into the AI's decision-making process.
-   **Human-in-the-Loop Escalations**: A dedicated inbox for tasks that require human intervention, with a structured form to provide corrective feedback and resubmit tasks.
-   **System & Integration Settings**: A configuration area for managing system settings, user preferences, and integrations like Google and Telegram.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Lucide React
-   **State Management**: Zustand
-   **Animations**: Framer Motion
-   **Routing**: React Router
-   **Data Visualization**: Recharts
-   **Backend**: Cloudflare Workers, Hono
-   **AI/Agents**: Cloudflare Agents SDK, OpenAI SDK

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/synapse_command.git
    cd synapse_command
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project by copying the example:
    ```bash
    cp .dev.vars.example .dev.vars
    ```

    Now, open `.dev.vars` and add your Cloudflare AI Gateway credentials. You can get these from your Cloudflare Dashboard.

    ```ini
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

4.  **Run the development server:**
    ```bash
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

## Development

The project is structured with the frontend UI in the `src` directory and the Cloudflare Worker backend in the `worker` directory.

-   `src/pages`: Contains the main page components for each view (Dashboard, Tasks, etc.).
-   `src/components`: Contains shared React components, including the UI components from shadcn.
-   `worker/agent.ts`: The core `ChatAgent` Durable Object class that manages task state.
-   `worker/userRoutes.ts`: Defines the API endpoints for the application.
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker, including bindings and settings.

### Available Scripts

-   `bun run dev`: Starts the Vite development server for the frontend and the Wrangler dev server for the worker.
-   `bun run build`: Builds the frontend application for production.
-   `bun run lint`: Lints the codebase using ESLint.
-   `bun run deploy`: Deploys the application to your Cloudflare account.

## Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate with your Cloudflare account:
    ```bash
    bunx wrangler login
    ```

2.  **Configure Production Secrets:**
    For production, it's recommended to set secrets directly in your Cloudflare dashboard or via the command line rather than using `.dev.vars`.
    ```bash
    bunx wrangler secret put CF_AI_API_KEY
    ```
    You will also need to update the `CF_AI_BASE_URL` in `wrangler.jsonc` with your production gateway URL.

3.  **Deploy the application:**
    Run the deploy script from the project root:
    ```bash
    bun run deploy
    ```
    This command will build the frontend, bundle the worker, and deploy it to Cloudflare.

Or deploy directly from GitHub with the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ImElijah88/Synapse)

## License

This project is licensed under the MIT License.