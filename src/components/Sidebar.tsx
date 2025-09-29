import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  AlertTriangle,
  Settings,
  BotMessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListChecks, label: 'Tasks' },
  { to: '/escalations', icon: AlertTriangle, label: 'Escalations' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'relative flex h-screen flex-col border-r bg-gray-100/40 p-4 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-50',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex items-center gap-3 px-2 pb-8">
          <BotMessageSquare className="h-8 w-8 text-indigo-500" />
          <span
            className={cn(
              'text-2xl font-bold tracking-tight transition-opacity',
              isCollapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            Synapse
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-4 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400',
                      isActive && 'bg-indigo-500/20 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
                      isCollapsed && 'justify-center'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn('font-medium', isCollapsed && 'sr-only')}>{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-5 top-1/2 -translate-y-1/2 rounded-full border bg-background hover:bg-muted"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}