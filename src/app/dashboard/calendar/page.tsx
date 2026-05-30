'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, day: 15, title: 'Project Launch', color: 'primary' },
    { id: 2, day: 12, title: 'API Review', color: 'muted' },
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', day: 15, color: 'primary' });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setIsModalOpen(false);
      setNewEvent({ title: '', day: 15, color: 'primary' });
      toast.success('Event added successfully');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Track project deadlines and team milestones."
        actions={
          <>
            <div className="flex items-center rounded-lg border bg-muted/30 p-1">
              <Button type="button" variant="ghost" size="icon-sm">
                <ChevronLeft className="size-4" />
              </Button>
              <div className="px-3 text-sm font-medium">{currentMonth} {currentYear}</div>
              <Button type="button" variant="ghost" size="icon-sm">
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              <Plus className="size-4" />
              Add event
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b bg-muted/30">
            {days.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-5">
            {Array.from({ length: 35 }).map((_, index) => {
              const day = (index % 31) + 1;
              const dayEvents = events.filter((event) => event.day === day);
              return (
                <div
                  key={index}
                  className={cn(
                    'group min-h-28 border-b border-r p-2 transition-colors hover:bg-muted/30 md:min-h-32 md:p-3',
                    index % 7 === 6 && 'border-r-0'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'flex size-7 items-center justify-center rounded-full text-sm text-muted-foreground',
                        day === 15 && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {day}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        setNewEvent({ ...newEvent, day });
                        setIsModalOpen(true);
                      }}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="truncate rounded-md border bg-background px-2 py-1 text-[11px] font-medium">
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new event</DialogTitle>
            <DialogDescription>Create a local calendar marker for this workspace view.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event name</Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })}
                placeholder="e.g. Weekly Sync"
                required
                autoFocus
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-day">Day</Label>
                <Input
                  id="event-day"
                  type="number"
                  min="1"
                  max="31"
                  value={newEvent.day}
                  onChange={(event) => setNewEvent({ ...newEvent, day: parseInt(event.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={newEvent.color} onValueChange={(value) => value && setNewEvent({ ...newEvent, color: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <CalendarIcon className="size-4" />
                Save event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
