'use client';

import { useEffect, useState } from 'react';
import { Bell, Eye, EyeOff, Globe, Lock, Mail, Save, Shield, Upload, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/page-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('General');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationStates, setNotificationStates] = useState([true, false, true, true]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const savedEnabled = localStorage.getItem('notificationsEnabled');
    const savedStates = localStorage.getItem('notificationStates');

    if (savedEnabled !== null) {
      setNotificationsEnabled(savedEnabled === 'true');
    }

    if (savedStates) {
      try {
        setNotificationStates(JSON.parse(savedStates));
      } catch {
        setNotificationStates([true, false, true, true]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('notificationStates', JSON.stringify(notificationStates));
  }, [notificationStates]);

  const handleSave = (message: any = 'Settings saved successfully') => {
    const finalMessage = typeof message === 'string' ? message : 'Settings saved successfully';
    toast.success(finalMessage);
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          setLogoPreview(event.target.result);
          handleSave('Logo updated successfully');
          setTimeout(() => {
            setActiveTab('General');
          }, 1500);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const toggleNotification = (index: number) => {
    const newStates = [...notificationStates];
    newStates[index] = !newStates[index];
    setNotificationStates(newStates);
  };

  const handleSecurityUpdate = () => {
    toast.success('Password updated. Logging out for security.');
    setTimeout(() => {
      logout();
      router.push('/login');
    }, 2000);
  };

  const tabs = [
    { name: 'General', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Members', icon: Users },
    { name: 'Security', icon: Lock },
    { name: 'Workspace', icon: Globe },
  ];

  const teamMembers = [
    { id: 1, name: 'Demo Admin', role: 'Admin', email: 'admin@flow.com', status: 'Active' },
    { id: 2, name: 'Demo Member', role: 'Member', email: 'member@flow.com', status: 'Active' },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage account preferences and workspace configuration."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <TabsList className="h-fit w-full flex-col items-stretch justify-start bg-transparent p-0" variant="line">
          {tabs.map((item) => (
            <TabsTrigger key={item.name} value={item.name} className="justify-start px-3 py-2">
              <item.icon className="size-4" />
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0">
          <TabsContent value="General">
            <Card>
              <CardHeader>
                <CardTitle>Profile information</CardTitle>
                <CardDescription>Update the visible account information for this workspace.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input id="full-name" defaultValue="Demo Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email address</Label>
                  <Input id="email-address" type="email" defaultValue="admin@flow.com" />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={handleSave}>
                  <Save className="size-4" />
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="Members">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>Workspace members</CardTitle>
                    <CardDescription>Review access and contact workspace members.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const email = window.prompt('Enter email address to add:');
                      if (email) window.alert(`Member ${email} has been invited to the workspace!`);
                    }}
                  >
                    Add member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <Shield className="size-3" />
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.status}</TableCell>
                        <TableCell className="text-right">
                          <Button type="button" variant="ghost" size="icon-sm">
                            <Mail className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose how you want to be notified about project updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Enable notifications</p>
                    <p className="text-sm text-muted-foreground">Turn all notification preferences on or off.</p>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>

                {[
                  { title: 'Email notifications', desc: 'Receive daily digests and immediate task alerts.' },
                  { title: 'Desktop alerts', desc: 'Get real-time browser notifications for mentions.' },
                  { title: 'Task assignments', desc: 'Notify me when I am assigned to a new task.' },
                  { title: 'Project milestones', desc: 'Alert me when a project reaches a major goal.' },
                ].map((item, index) => (
                  <div key={item.title} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notificationStates[index]}
                      onCheckedChange={() => toggleNotification(index)}
                      disabled={!notificationsEnabled}
                      className="ml-auto"
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={handleSave}>
                  <Save className="size-4" />
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="Security">
            <Card>
              <CardHeader>
                <CardTitle>Password management</CardTitle>
                <CardDescription>Update credentials and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid max-w-md gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <div className="relative">
                      <Input id="current-password" type={showCurrentPassword ? 'text' : 'password'} placeholder="Current password" className="pr-10" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <div className="relative">
                      <Input id="new-password" type={showNewPassword ? 'text' : 'password'} placeholder="New password" className="pr-10" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Secure your account with an extra layer of protection.</p>
                  </div>
                  <Switch checked={is2FAEnabled} onCheckedChange={setIs2FAEnabled} />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={handleSecurityUpdate}>
                  Update security
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="Workspace">
            <Card>
              <CardHeader>
                <CardTitle>Workspace configuration</CardTitle>
                <CardDescription>Customize workspace identity and address.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-[1fr_160px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace name</Label>
                    <Input id="workspace-name" defaultValue="FlowSync Team" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-url">Workspace URL</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">flowSync.ai/</span>
                      <Input id="workspace-url" defaultValue="main-team" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Workspace logo</Label>
                  <button
                    type="button"
                    onClick={handleLogoUpload}
                    className="flex aspect-square w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed bg-muted/30 text-sm text-muted-foreground transition-colors hover:bg-muted"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="size-full object-cover" />
                    ) : (
                      <>
                        <Upload className="size-5" />
                        Upload logo
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={handleSave}>
                  Save workspace settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
