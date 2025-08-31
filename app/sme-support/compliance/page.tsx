'use client'

import {
  ArrowLeft,
  Building2,
  CheckCircle,
  FileText,
  MapPin,
  Network,
  TrendingUp,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { getWorkflowState } from '../workflow-state'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function SMESupportPage() {
  const router = useRouter()
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false)

  useEffect(() => {
    const state = getWorkflowState()
    setIsAssessmentComplete(state.assessmentCompleted)
  }, [])

  const handleBackToDemo = () => {
    router.push('/sme-support')
  }

  const handleObligationsClick = () => {
    router.push('/sme-support/obligations')
  }

  const handleBundlesClick = () => {
    router.push('/sme-support/bundles')
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
              onClick={handleBackToDemo}
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
              <h1 className="text-2xl font-bold">SME Compliance Support</h1>
            </div>
          </div>
          <div className="text-sm opacity-90 hidden md:block">
            Personalized business compliance guidance
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Compliance Services Available</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-amber-50 border-amber-200">
              Business Owner - Cathy Cook
            </Badge>
            <Badge variant="outline">
              Catering Business, Yarra Council
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Based on your business profile, we&apos;ve identified priority compliance requirements and guidance tailored to your catering business in Yarra.
          </p>
        </div>

        {/* Priority Cards - Top Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Obligations Assessment Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg border-blue-200 bg-blue-50/30"
            onClick={handleObligationsClick}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Business Obligations Assessment</CardTitle>
                  <CardDescription>
                    Comprehensive compliance requirements analysis
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">15 Items</div>
                  <div className="text-sm text-blue-600">Found</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Critical: 3 items • High: 4 items • Medium: 3 items • Low: 5 items</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Interactive obligation graph showing Tax Backbone, Premises requirements, and regulatory dependencies.
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <Network className="w-4 h-4 mr-2" />
                  View Obligations Graph
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Calendar Card */}
          <Card className="cursor-pointer transition-all hover:shadow-lg border-green-200 bg-green-50/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Process Bundling Available</CardTitle>
                  <CardDescription>
                    Grouped workflows for efficient compliance
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">4 Bundles</div>
                  <div className="text-sm text-green-600">Ready</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Tax • Premises • Waste Management • Workforce</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Streamlined process bundles with calendar integration and task management for your catering business.
                </div>
                <Button 
                  className={`w-full ${isAssessmentComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'}`} 
                  disabled={!isAssessmentComplete}
                  onClick={isAssessmentComplete ? handleBundlesClick : undefined}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isAssessmentComplete ? 'Access Process Bundles' : 'Complete Assessment First'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regulator Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Relevant Regulatory Bodies</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Commonwealth</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Australian Taxation Office (ATO)</li>
                <li>• Fair Work Australia</li>
                <li>• Federal Register</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Victoria</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Department of Health</li>
                <li>• Environment Protection Authority</li>
                <li>• OH&S Victoria</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Local (Yarra)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Food business registration</li>
                <li>• Outdoor dining permits</li>
                <li>• Signage approvals</li>
                <li>• Waste management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}