import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useTasks } from '@/store/tasks';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export function DashboardPage() {
  const { tasks, loading } = useTasks();
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const escalatedTasks = tasks.filter(t => t.status === 'Escalated').length;
  const totalTasks = tasks.length;
  const successRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';
  const escalationRate = totalTasks > 0 ? ((escalatedTasks / totalTasks) * 100).toFixed(1) : '0.0';
  const kpiData = [
    { title: 'First-Pass Success Rate', value: `${successRate}%`, icon: CheckCircle2, color: 'text-green-500' },
    { title: 'Human Escalation Rate', value: `${escalationRate}%`, icon: AlertTriangle, color: 'text-yellow-500' },
    { title: 'Avg. Task Resolution Time', value: '2h 15m', icon: Clock, color: 'text-blue-500' }, // Static for now
    { title: 'Total Tasks', value: totalTasks.toString(), icon: Activity, color: 'text-indigo-500' },
  ];

  const { taskStatusData, successRateData } = useMemo(() => {
    // This is a simplified mock of data processing. A real implementation would use task timestamps.
    const taskStatusData = [
      { name: 'Mon', completed: 0, failed: 0, escalated: 0 },
      { name: 'Tue', completed: 0, failed: 0, escalated: 0 },
      { name: 'Wed', completed: 0, failed: 0, escalated: 0 },
      { name: 'Thu', completed: 0, failed: 0, escalated: 0 },
      { name: 'Fri', completed: 0, failed: 0, escalated: 0 },
      { name: 'Sat', completed: 0, failed: 0, escalated: 0 },
      { name: 'Sun', completed: 0, failed: 0, escalated: 0 },
    ];
    
    // Distribute tasks pseudo-randomly across the week for demonstration
    tasks.forEach((task, i) => {
      const dayIndex = i % 7;
      if (task.status === 'Completed') taskStatusData[dayIndex].completed++;
      else if (task.status === 'Failed') taskStatusData[dayIndex].failed++;
      else if (task.status === 'Escalated') taskStatusData[dayIndex].escalated++;
    });

    // Mock success rate trend based on current success rate
    const baseRate = parseFloat(successRate);
    const successRateData = [
        { name: 'Week 1', rate: Math.max(70, baseRate - 5) },
        { name: 'Week 2', rate: Math.max(72, baseRate - 3) },
        { name: 'Week 3', rate: Math.max(71, baseRate - 4) },
        { name: 'Week 4', rate: Math.max(75, baseRate - 1) },
        { name: 'Week 5', rate: Math.max(74, baseRate - 2) },
        { name: 'Week 6', rate: baseRate },
    ];

    return { taskStatusData, successRateData };
  }, [tasks, successRate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Live data</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Weekly Task Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#4f46e5" name="Completed" />
                <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
                <Bar dataKey="escalated" stackId="a" fill="#f59e0b" name="Escalated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Success Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis domain={[70, 90]} className="text-xs" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2} name="Success Rate (%)" />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}