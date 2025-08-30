'use client'

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  FileText,
  Key,
  Phone,
  Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LogoImage } from '../../../../src/components/LogoImage'
import { Badge } from '../../../../src/components/ui/badge'
import { Button } from '../../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../src/components/ui/card'

export default function PreparationPage() {
  const router = useRouter()

  const handleBackToSupport = () => {
    router.push('/loss-of-job/support')
  }

  const handleBackToEligibility = () => {
    router.push('/loss-of-job/support')
  }

  const preparationItems = [
    {
      id: 1,
      title: "Set up MyGov passkey",
      description: "Digital identity verification for secure access",
      icon: Key,
      status: "required",
      urgent: true,
      details: "Your MyGov passkey is essential for accessing government services securely. This replaces passwords and provides stronger security."
    },
    {
      id: 2,
      title: "Enable bank account alerts",
      description: "Get notified of payment deposits and changes",
      icon: Bell,
      status: "recommended",
      urgent: true,
      details: "Set up SMS or email notifications to track your JobSeeker payments and avoid missing important updates."
    },
    {
      id: 3,
      title: "Gather required documents",
      description: "Birth certificate, bank details, employment records",
      icon: FileText,
      status: "required",
      urgent: false,
      details: "You&apos;ll need proof of identity, income history, and bank account details for your application."
    },
    {
      id: 4,
      title: "Understand reporting obligations",
      description: "Learn about fortnightly reporting requirements",
      icon: Calendar,
      status: "important",
      urgent: false,
      details: "You must report your income and circumstances every fortnight to continue receiving payments."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSupport}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Support
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
              <h1 className="text-2xl font-bold">Appointment Preparation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Success Message */}
        <Card className="border-green-200 bg-green-50/30 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Registration Complete!</CardTitle>
                <CardDescription className="text-green-700">
                  Your application has been submitted for assessment
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Preparation Checklist - Elevated to top */}
        <Card className="border-amber-200 bg-amber-50/20 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Be Prepared: Essential Setup Tasks</CardTitle>
                <CardDescription>
                  Complete these important steps before your appointment
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preparationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Card key={item.id} className={`${item.urgent ? 'border-red-200 bg-red-50/20' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            item.urgent ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.details}
                      </p>
                      <Button size="sm" variant="outline">
                        {item.urgent ? "Set Up Now" : "Learn More"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your Next Appointment
              </CardTitle>
              <CardDescription>
                Recommended in-person meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">Melbourne Central Service Centre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-sm">Level 2, 360 Elizabeth St</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Suggested Time:</span>
                  <span className="text-sm">Tuesday 10:00am</span>
                </div>
                <div className="pt-3">
                  <Button className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Official Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Need Help Getting Ready?
              </CardTitle>
              <CardDescription>
                Support with preparation steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Our support team can help you with MyGov setup, document gathering, and understanding requirements.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Preparation Help: 1800 567 890
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    MyGov Setup Assistance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Journey */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Continue Your Support Journey</CardTitle>
            <CardDescription>
              Explore additional services while you prepare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackToEligibility} className="w-full" size="lg">
              Return to Support Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}