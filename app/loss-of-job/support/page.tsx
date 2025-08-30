'use client'

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  FileText,
  GraduationCap,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  TrendingUp,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function JobSeekerSupportPage() {
  const router = useRouter()

  const handleBackToLossOfJob = () => {
    router.push('/loss-of-job')
  }

  const handleEligibilityClick = () => {
    router.push('/loss-of-job/support/eligibility')
  }

  const handleAdviceClick = () => {
    router.push('/loss-of-job/support/advice')
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
              onClick={handleBackToLossOfJob}
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
              <h1 className="text-2xl font-bold">Worker/Jobseeker Support</h1>
            </div>
          </div>
          <div className="text-sm opacity-90 hidden md:block">
            Personalized assistance and guidance
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Support Services Available</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-amber-50 border-amber-200">
              High Priority
            </Badge>
            <Badge variant="outline">
              Immediate Assistance Available
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Based on your situation, we&apos;ve identified priority support services and guidance tailored to your needs.
          </p>
        </div>

        {/* Priority Cards - Top Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Eligibility Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg border-green-200 bg-green-50/30"
            onClick={handleEligibilityClick}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">JobSeeker Payment Eligibility</CardTitle>
                  <CardDescription>
                    Assessment of potential eligibility
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">Likely Eligible</div>
                  <div className="text-sm text-green-600">(83% confidence)</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">Assessment based on your employment history and current situation</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Click to see detailed eligibility breakdown and estimated payment amounts.
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Eligibility Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contextual Advice Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg border-blue-200 bg-blue-50/30"
            onClick={handleAdviceClick}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Local Job Market Insights</CardTitle>
                  <CardDescription>
                    Contextual advice for your area
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    <TrendingUp className="w-5 h-5 inline mr-1" />
                    Active
                  </div>
                  <div className="text-sm text-blue-600">Market trends</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Based on your location and skill profile</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Get insights into local job opportunities, industry trends, and targeted career advice.
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Job Market Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Support Services */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Additional Support Services</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resume and Interview Support */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Resume & Interview Support</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Professional resume writing and interview preparation services
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills Assessment */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Skills Assessment</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Identify your strengths and areas for development
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mental Health Support */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Mental Health Support</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Counseling and support services during job transition
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Access Support
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Counseling */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Financial Counseling</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Budgeting assistance and debt management advice
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Get Advice
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Training Programs */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Training Programs</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Government-funded courses and certifications
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Browse Courses
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Support */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Emergency Assistance</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Immediate financial relief and crisis support
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Get Help Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Need Immediate Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Speak directly with a support specialist who can guide you through available services and next steps.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Phone className="w-4 h-4 mr-2" />
                Call Now: 1800 123 456
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Request Callback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}