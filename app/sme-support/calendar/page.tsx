'use client'

import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { Calendar } from '../../../src/components/Calendar'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function CalendarPage() {
  const router = useRouter()
  const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const [acceptedPlan, setAcceptedPlan] = useState(false)

  const handleBack = () => {
    router.push('/sme-support/bundles')
  }

  const handleAcceptPlan = () => {
    setAcceptedPlan(true)
    router.push('/sme-support/bundles')
  }

  const recurringTasks = [
    {
      id: 'bas',
      name: 'BAS (Business Activity Statement)',
      frequency: 'Quarterly',
      nextDue: '2024-10-28',
      description: 'Report GST, PAYG withholding, and other tax obligations',
      urgent: false,
      added: false
    },
    {
      id: 'payg',
      name: 'PAYG/W (Pay As You Go Withholding)',
      frequency: 'Monthly',
      nextDue: '2024-09-21',
      description: 'Report and remit employee tax withholdings',
      urgent: true,
      added: false
    },
    {
      id: 'stp',
      name: 'STP (Single Touch Payroll)',
      frequency: 'Pay per run',
      nextDue: '2024-09-15',
      description: 'Report payroll information with each pay run',
      urgent: true,
      added: false
    }
  ]

  const calendarEvents = [
    {
      date: 15,
      type: 'urgent' as const,
      title: 'STP (Single Touch Payroll)'
    },
    {
      date: 21,
      type: 'tax' as const,
      title: 'PAYG/W Monthly Return'
    },
    {
      date: 28,
      type: 'tax' as const,
      title: 'BAS (quarterly)'
    }
  ];

  const upcomingEvents = [
    {
      date: '2024-09-15',
      title: 'STP Reporting Due',
      type: 'tax',
      urgent: true
    },
    {
      date: '2024-09-21',
      title: 'PAYG/W Monthly Return',
      type: 'tax',
      urgent: true
    },
    {
      date: '2024-10-01',
      title: 'Food Safety Supervisor Certification',
      type: 'premises',
      urgent: false
    },
    {
      date: '2024-10-15',
      title: 'Public Liability Insurance Renewal',
      type: 'premises',
      urgent: false
    },
    {
      date: '2024-10-28',
      title: 'BAS Quarterly Return',
      type: 'tax',
      urgent: false
    }
  ]

  const [tasks, setTasks] = useState(recurringTasks)

  const handleAddToTasks = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, added: true } : task
    ))
  }

  const getViewButtonClass = (viewType: 'weekly' | 'monthly' | 'yearly') => 
    view === viewType ? 'bg-primary text-primary-foreground' : 'variant-outline'

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'tax': return 'bg-blue-500'
      case 'premises': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <LogoImage 
                  width={32}
                  height={32}
                  className="w-8 h-8 object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold">Calendar</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* View Controls */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar View</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={view === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setView('weekly')}
                >
                  Weekly
                </Button>
                <Button
                  size="sm"
                  variant={view === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setView('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  size="sm"
                  variant={view === 'yearly' ? 'default' : 'outline'}
                  onClick={() => setView('yearly')}
                >
                  Yearly
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Recurring Tasks Setup */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Recurring Tax Obligations</CardTitle>
            <CardDescription>
              Set up automatic reminders for your regular compliance tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className={task.urgent ? 'border-red-200 bg-red-50/10' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {task.name}
                          {task.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Due Soon
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {task.frequency} • Next due: {task.nextDue}
                        </CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddToTasks(task.id)}
                        disabled={task.added}
                        variant={task.added ? 'default' : 'outline'}
                      >
                        {task.added ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add to My Tasks
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your compliance calendar for the next few months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                    <div className="text-sm font-medium">{event.date}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Calendar */}
        <div className="mb-6">
          <Calendar view={view} events={calendarEvents} />
        </div>

        {/* Accept Plan */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Ready to Implement Your Compliance Plan?</CardTitle>
            <CardDescription>
              Accept this plan to add all tasks to your timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAcceptPlan} 
              className="w-full" 
              size="lg"
            >
              Accept Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}