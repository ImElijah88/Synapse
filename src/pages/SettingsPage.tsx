import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, KeyRound, Link as LinkIcon, UserCircle } from 'lucide-react';
export function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Manage your account, integrations, and preferences.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCircle /> Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Synapse User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@synapse.ai" />
            </div>
          </div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LinkIcon /> Integrations</CardTitle>
          <CardDescription>Connect your accounts to enable full functionality.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Google Account</h3>
              <p className="text-sm text-gray-500">For Google Sheets logging and Google Drive escalations.</p>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">Telegram</h3>
              <p className="text-sm text-gray-500">For task supervision approvals and notifications.</p>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="task-completion" className="flex flex-col gap-1">
                    <span>Task Completion</span>
                    <span className="font-normal text-sm text-gray-500">Notify when a task is successfully completed.</span>
                </Label>
                <Switch id="task-completion" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="task-failure" className="flex flex-col gap-1">
                    <span>Task Failure</span>
                    <span className="font-normal text-sm text-gray-500">Notify when a task fails after all retries.</span>
                </Label>
                <Switch id="task-failure" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="escalation-required" className="flex flex-col gap-1">
                    <span>Escalation Required</span>
                    <span className="font-normal text-sm text-gray-500">Notify immediately when a task requires human intervention.</span>
                </Label>
                <Switch id="escalation-required" defaultChecked />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}