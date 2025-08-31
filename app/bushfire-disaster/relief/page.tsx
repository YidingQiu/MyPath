'use client'

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  FileText,
  Heart,
  Home,
  MapPin,
  Phone,
  Shield,
  User,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function ReliefSupportPage() {
  const router = useRouter()
  const [completedActions, setCompletedActions] = useState<string[]>([])

  const handleBackToEvacuation = () => {
    router.push('/bushfire-disaster/evacuation')
  }

  const handleRecoveryPlanClick = () => {
    router.push('/bushfire-disaster/recovery')
  }

  const handleCompleteAction = (actionId: string) => {
    setCompletedActions(prev => [...prev, actionId])
  }

  const isCompleted = (actionId: string) => completedActions.includes(actionId)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToEvacuation}
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
              <h1 className="text-2xl font-bold">Emergency Relief Support</h1>
            </div>
          </div>
          <div className="text-sm opacity-90 hidden md:block">
            Immediate assistance services
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Status Banner */}
        <div className="mb-6">
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">You&apos;re Safe at Evacuation Centre</CardTitle>
                  <CardDescription>
                    Flemington Community Centre • Access to emergency relief services now available
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* High Priority Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            High Priority Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className={`transition-all ${isCompleted('wellbeing') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <CardTitle className="text-base">Well-being Check</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Immediate health and safety assessment
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={isCompleted('wellbeing') ? 'outline' : 'default'}
                    onClick={() => handleCompleteAction('wellbeing')}
                    disabled={isCompleted('wellbeing')}
                  >
                    {isCompleted('wellbeing') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Start Check'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all ${isCompleted('payment') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-500" />
                  <CardTitle className="text-base">Lodge Disaster Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Emergency financial assistance ($1,000)
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={isCompleted('payment') ? 'outline' : 'default'}
                    onClick={() => handleCompleteAction('payment')}
                    disabled={isCompleted('payment')}
                  >
                    {isCompleted('payment') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all ${isCompleted('register') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-500" />
                  <CardTitle className="text-base">Register at Recovery Hub</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Official registration for coordinated support
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    variant={isCompleted('register') ? 'outline' : 'default'}
                    onClick={() => handleCompleteAction('register')}
                    disabled={isCompleted('register')}
                  >
                    {isCompleted('register') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medium Priority Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Medium Priority Actions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className={`transition-all ${isCompleted('bank') ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-base">Bank Hardship Request</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Request mortgage/loan deferrals and fee waivers
                  </p>
                  <Button 
                    size="sm" 
                    variant={isCompleted('bank') ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => handleCompleteAction('bank')}
                    disabled={isCompleted('bank')}
                  >
                    {isCompleted('bank') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Contact Bank'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all ${isCompleted('insurance') ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-base">Insurer First Notice</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Report potential property damage to insurers
                  </p>
                  <Button 
                    size="sm" 
                    variant={isCompleted('insurance') ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => handleCompleteAction('insurance')}
                    disabled={isCompleted('insurance')}
                  >
                    {isCompleted('insurance') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Report Loss'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all ${isCompleted('documents') ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-base">Document Replacement</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Replace lost ID, licenses, and certificates
                  </p>
                  <Button 
                    size="sm" 
                    variant={isCompleted('documents') ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => handleCompleteAction('documents')}
                    disabled={isCompleted('documents')}
                  >
                    {isCompleted('documents') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Start Process'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card className="mb-6 bg-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contact Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm"><strong>Emergency Services:</strong> 000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm"><strong>SES Assistance:</strong> 132 500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm"><strong>Red Cross Register:</strong> 1800 727 077</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm"><strong>Disaster Relief Hotline:</strong> 1800 560 760</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm"><strong>Mental Health Support:</strong> 1800 512 348</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm"><strong>VicEmergency Hotline:</strong> 1800 226 226</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Immediate Relief Progress</span>
            <span className="text-sm text-muted-foreground">{completedActions.length}/6 completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all" 
              style={{ width: `${(completedActions.length / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Next Steps */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Ready for Long-term Recovery?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Once your immediate needs are addressed, we can help you plan your long-term recovery and rebuilding process.
            </p>
            <Button onClick={handleRecoveryPlanClick} className="w-full md:w-auto">
              <ArrowRight className="w-4 h-4 mr-2" />
              Access Recovery Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}