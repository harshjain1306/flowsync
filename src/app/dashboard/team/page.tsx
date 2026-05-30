'use client';

import { useState } from 'react';
import { Mail, MoreHorizontal, Search, Send, Shield, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const teamMembers = [
  { id: 1, name: 'Demo Admin', role: 'Admin', email: 'admin@flow.com', status: 'Active', avatar: 'A' },
  { id: 2, name: 'Demo Member', role: 'Member', email: 'member@flow.com', status: 'Online', avatar: 'M' },
  { id: 3, name: 'Sarah Wilson', role: 'Designer', email: 'sarah@flow.com', status: 'Offline', avatar: 'S' },
  { id: 4, name: 'Alex Rivera', role: 'Developer', email: 'alex@flow.com', status: 'Active', avatar: 'A' },
];

export default function TeamPage() {
  const [activeChat, setActiveChat] = useState<any>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { id: 1, text: 'Hey! How can I help you with the project today?', isMe: false },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = { id: Date.now(), text: message, isMe: true };
    setChatHistory((prev) => [...prev, newMsg]);
    setMessage('');

    setTimeout(() => {
      const responses = [
        "Got it. I'll look into that right away.",
        'That sounds like a great plan.',
        "Sure thing, I'm on it.",
        'Let me check the latest updates on that.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory((prev) => [...prev, { id: Date.now() + 1, text: randomResponse, isMe: false }]);
    }, 1500);
  };

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteEmail.trim()) return;
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team members"
        description="Manage workspace members, access levels, and quick conversations."
        actions={
          <Button type="button" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Invite member
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search members by name or email..." className="pl-9" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="transition-all duration-200 hover:-translate-y-0.5 hover:ring-foreground/20">
            <CardContent>
              <div className="mb-4 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Member actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Change role</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="size-20">
                    <AvatarFallback className="text-xl">{member.avatar}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'absolute bottom-1 right-1 size-3 rounded-full border-2 border-background',
                      member.status === 'Active' || member.status === 'Online' ? 'bg-primary' : 'bg-muted-foreground'
                    )}
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                <Badge variant="outline" className="mt-4 gap-1">
                  <Shield className="size-3" />
                  {member.role === 'Admin' ? 'Workspace owner' : member.role}
                </Badge>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-5 w-full"
                  onClick={() => {
                    setActiveChat(member);
                    setChatHistory([{ id: 1, text: 'Hey! How can I help you with the project today?', isMe: false }]);
                  }}
                >
                  <Mail className="size-4" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>Send an invitation to join this workspace.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@company.com"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {activeChat && (
            <>
              <SheetHeader className="border-b">
                <div className="flex items-center gap-3 pr-8">
                  <Avatar>
                    <AvatarFallback>{activeChat.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{activeChat.name}</SheetTitle>
                    <SheetDescription>{activeChat.status}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={cn('flex', msg.isMe ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-[82%] rounded-lg border px-3 py-2 text-sm leading-relaxed',
                          msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted/50'
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2 border-t p-4">
                <Input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()}
                />
                <Button type="button" size="icon" disabled={!message.trim()} onClick={handleSendMessage}>
                  <Send className="size-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
