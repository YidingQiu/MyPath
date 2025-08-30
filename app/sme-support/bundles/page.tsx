'use client'

import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Package,
  Receipt,
  Shield,
  Trash2,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function BundlesPage() {
  const router = useRouter()
  const [acceptedPlan, setAcceptedPlan] = useState(false)

  const handleBack = () => {
    router.push('/sme-support/obligations')
  }

  const handleSeeCalendar = () => {
    router.push('/sme-support/calendar')
  }

  const handleViewObligations = () => {
    router.push('/sme-support/obligations-detailed')
  }

  const handleAcceptPlan = () => {
    setAcceptedPlan(true)
  }

  const processBundles = [
    {
      id: 'tax',
      name: 'Tax',
      icon: Receipt,
      items: ['ABN', 'PAYG Withholding', 'GST Registration', 'BAS Quarterly'],
      timeframe: '1-3 days',
      priority: 'critical'
    },
    {
      id: 'premises',
      name: 'Premises',
      icon: Shield,
      items: ['Planning Permit', 'Food premises registration', 'Occupancy Permit', 'Public liability insurance'],
      timeframe: '3-5 days',
      priority: 'critical'
    },
    {
      id: 'waste',
      name: 'Waste Management',
      icon: Trash2,
      items: ['Trade waste consent', 'Grease trap', 'Commercial waste collection'],
      timeframe: '7-14 days',
      priority: 'medium'
    },
    {
      id: 'workforce',
      name: 'Workforce',
      icon: Users,
      items: ['Work Cover Insurance', 'Single Touch Payroll', 'Fair Work Classification'],
      timeframe: '7-14 days',
      priority: 'high'
    }
  ]

  const initialTasks = [
    { id: 1, title: 'Register ABN with ATO', bundle: 'Tax', status: 'pending', urgent: true },
    { id: 2, title: 'Apply for food premises registration', bundle: 'Premises', status: 'pending', urgent: true },
    { id: 3, title: 'Get public liability insurance quote', bundle: 'Premises', status: 'pending', urgent: true }
  ]

  const additionalTasks = [
    { id: 4, title: 'Set up PAYG withholding', bundle: 'Tax', status: 'pending', urgent: false },
    { id: 5, title: 'Complete GST registration', bundle: 'Tax', status: 'pending', urgent: false },
    { id: 6, title: 'Submit planning permit application', bundle: 'Premises', status: 'pending', urgent: false },
    { id: 7, title: 'Arrange work cover insurance', bundle: 'Workforce', status: 'pending', urgent: false },
    { id: 8, title: 'Set up STP reporting', bundle: 'Workforce', status: 'pending', urgent: false }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-200 bg-red-50/20'
      case 'high': return 'border-orange-200 bg-orange-50/20'
      case 'medium': return 'border-blue-200 bg-blue-50/20'
      default: return 'border-gray-200 bg-gray-50/20'
    }
  }

  const tasks = acceptedPlan ? [...initialTasks, ...additionalTasks] : initialTasks

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
              <h1 className="text-2xl font-bold">Process Bundles</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Process Bundles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>The following process bundles have been created for you:</CardTitle>
            <CardDescription>
              Related obligations grouped into manageable workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {processBundles.map((bundle) => {
                const IconComponent = bundle.icon
                return (
                  <Card key={bundle.id} className={getPriorityColor(bundle.priority)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bundle.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {bundle.timeframe}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 mb-3">
                        {bundle.items.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {item}
                          </div>
                        ))}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {bundle.priority} priority
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Button 
            onClick={handleSeeCalendar} 
            className="h-16 text-lg" 
            variant="outline"
          >
            <Calendar className="w-5 h-5 mr-2" />
            See Calendar
          </Button>
          
          <Card className="bg-amber-50/20 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={handleViewObligations} 
                className="w-full" 
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Business Obligations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Task Board */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>
                  {acceptedPlan ? 'Complete implementation plan' : 'Initial priority tasks'}
                </CardDescription>
              </div>
              {!acceptedPlan && (
                <Button onClick={handleAcceptPlan} size="sm">
                  Accept Plan
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className={task.urgent ? 'border-red-200 bg-red-50/10' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          task.status === 'completed' 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {task.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Bundle: {task.bundle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {acceptedPlan && (
          <Card className="bg-green-50/30 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-green-800">Plan Accepted!</CardTitle>
                  <CardDescription className="text-green-700">
                    Additional tasks have been added to your timeline
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}