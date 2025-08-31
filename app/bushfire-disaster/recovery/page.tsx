'use client'

import {
  AlertTriangle,
  ArrowLeft,
  Building,
  CheckCircle,
  CreditCard,
  FileText,
  Home,
  MapPin,
  Phone,
  Shield,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'
import { Alert, AlertDescription } from '../../../src/components/ui/alert'

export default function RecoveryPlanPage() {
  const router = useRouter()
  const [planAccepted, setPlanAccepted] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleBackToRelief = () => {
    router.push('/bushfire-disaster/relief')
  }

  const handleAcceptPlan = () => {
    setPlanAccepted(true)
  }

  const handleCompleteStep = (stepNumber: number) => {
    setCompletedSteps(prev => [...prev, stepNumber])
  }

  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber)

  const recoverySteps = [
    {
      id: 1,
      title: 'Initiate Insurance Claims',
      description: 'Contact your insurers to report damage and start claims process',
      category: 'Renters contents • Motor (comprehensive)',
      priority: 'high',
      estimatedTime: '1-2 days'
    },
    {
      id: 2,
      title: 'Request Disaster Assist Support',
      description: 'Apply for government disaster assistance payments and services',
      category: 'Emergency financial relief',
      priority: 'high',
      estimatedTime: '3-5 days'
    },
    {
      id: 3,
      title: 'Request Disaster Recovery Allowance',
      description: 'Income support during recovery period',
      category: 'Ongoing financial assistance',
      priority: 'medium',
      estimatedTime: '1-2 weeks'
    },
    {
      id: 4,
      title: 'Organise Temporary Accommodation',
      description: 'Secure temporary housing while assessing damage',
      category: 'Emergency accommodation',
      priority: 'high',
      estimatedTime: '1-3 days'
    },
    {
      id: 5,
      title: 'Replacement ID and Documents',
      description: 'Replace damaged identification and important documents',
      category: 'Identity documents',
      priority: 'medium',
      estimatedTime: '1-2 weeks'
    },
    {
      id: 6,
      title: 'Rebuild Grant Application',
      description: 'Apply for government rebuilding grants and assistance',
      category: 'Long-term recovery',
      priority: 'low',
      estimatedTime: '2-4 weeks'
    }
  ]

  if (!planAccepted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToRelief}
                className="text-primary-foreground hover:bg-primary/80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Relief
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
                <h1 className="text-2xl font-bold">Disaster Recovery Plan</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          {/* Plan Introduction */}
          <div className="mb-8">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Personalized Recovery Support Plan
                </CardTitle>
                <CardDescription>
                  Based on recent bushfires in your area, you are likely eligible for disaster relief support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-amber-200 bg-amber-50 mb-4">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This structured plan will guide you through the recovery process step by step, ensuring you don&apos;t miss any important assistance or deadlines.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Recovery Steps Preview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Recovery Plan (6 Steps)</h3>
            <div className="space-y-4">
              {recoverySteps.map((step, index) => (
                <Card key={step.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {step.id}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {step.category}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={
                            step.priority === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                            step.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                            'bg-gray-50 border-gray-200 text-gray-700'
                          }
                        >
                          {step.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <div className="text-xs text-blue-600">
                      Estimated time: {step.estimatedTime}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Accept Plan */}
          <Card className="bg-green-50/50 border-green-200">
            <CardHeader>
              <CardTitle>Ready to Start Your Recovery?</CardTitle>
              <CardDescription>
                Accept this plan to begin your guided recovery process with personalized assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleAcceptPlan} size="lg" className="w-full bg-green-500 hover:bg-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Recovery Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              onClick={handleBackToRelief}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Relief
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
              <h1 className="text-2xl font-bold">Recovery Dashboard</h1>
            </div>
          </div>
          <div className="text-sm opacity-90 hidden md:block">
            Persona: Affected by natural disaster – bushfire
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Current Recommended Action */}
        <div className="mb-6">
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Recommended Action: Initiate Insurance Claims
              </CardTitle>
              <CardDescription>
                Your next priority step in the recovery process
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recovery Steps Progress */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Recovery Progress</h3>
          <div className="space-y-4">
            {recoverySteps.map((step) => (
              <Card 
                key={step.id} 
                className={`transition-all ${
                  isStepCompleted(step.id) ? 'bg-green-50 border-green-200' : 
                  step.id === 1 ? 'border-blue-200 bg-blue-50/30' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isStepCompleted(step.id) ? 'bg-green-500 text-white' :
                        step.id === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isStepCompleted(step.id) ? <CheckCircle className="w-4 h-4" /> : step.id}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>
                          {step.category}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={
                          step.priority === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                          step.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                          'bg-gray-50 border-gray-200 text-gray-700'
                        }
                      >
                        {step.priority}
                      </Badge>
                      {!isStepCompleted(step.id) && step.id === 1 && (
                        <Button 
                          size="sm"
                          onClick={() => handleCompleteStep(step.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {isStepCompleted(step.id) && (
                        <Badge className="bg-green-100 border-green-300 text-green-700">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground flex-1">
                      {step.description}
                    </p>
                    <div className="text-xs text-blue-600 ml-4">
                      {step.estimatedTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Conditions Update */}
        <Card className="bg-amber-50/50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Latest Emergency Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="font-medium text-sm">Road Closures</div>
                <div className="text-xs text-muted-foreground">M80 Western Ring Road, Calder Highway, Western Freeway</div>
              </div>
              <div>
                <div className="font-medium text-sm">Air Quality</div>
                <div className="text-xs text-muted-foreground">Air pollution = 2,100 (Hazardous)</div>
              </div>
              <div>
                <div className="font-medium text-sm">Power Outages</div>
                <div className="text-xs text-muted-foreground">Moonee Ponds, Flemington, Essendon North</div>
              </div>
            </div>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Conditions are improving but remain hazardous. Continue to follow official emergency updates.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}