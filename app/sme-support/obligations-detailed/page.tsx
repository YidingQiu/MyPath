'use client'

import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Info,
  MapPin,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function ObligationsDetailedPage() {
  const router = useRouter()
  const [hoveredObligation, setHoveredObligation] = useState<string | null>(null)

  const handleBack = () => {
    router.push('/sme-support/bundles')
  }

  const handleBackToCompliance = () => {
    router.push('/sme-support/compliance')
  }

  const obligations = [
    {
      id: 'abn',
      name: 'ABN',
      status: 'missing',
      source: 'Australian Taxation Office (ATO)',
      instrument: 'A New Tax System (Australian Business Number) Act 1999',
      dateAdded: '2024-09-01',
      reason: 'Required for all business operations in Australia',
      description: 'Australian Business Number registration with the ATO',
      urgency: 'critical',
      daysToComplete: 0
    },
    {
      id: 'payg',
      name: 'PAYG/W',
      status: 'incomplete',
      source: 'Australian Taxation Office (ATO)',
      instrument: 'Taxation Administration Act 1953',
      dateAdded: '2024-09-01',
      reason: 'Required when employing staff or contractors',
      description: 'Pay As You Go Withholding registration',
      urgency: 'high',
      daysToComplete: 1
    },
    {
      id: 'gst',
      name: 'GST',
      status: 'incomplete',
      source: 'Australian Taxation Office (ATO)',
      instrument: 'A New Tax System (Goods and Services Tax) Act 1999',
      dateAdded: '2024-09-01',
      reason: 'Turnover expected to exceed $75,000 annually',
      description: 'Goods and Services Tax registration',
      urgency: 'high',
      daysToComplete: 2
    },
    {
      id: 'workcover',
      name: 'Work Cover Insurance',
      status: 'upcoming',
      source: 'WorkSafe Victoria',
      instrument: 'Workplace Injury Rehabilitation and Compensation Act 2013',
      dateAdded: '2024-09-01',
      reason: 'Mandatory for businesses with employees',
      description: 'Workers compensation insurance coverage',
      urgency: 'medium',
      daysToComplete: 14
    },
    {
      id: 'stp',
      name: 'Single Touch Payroll',
      status: 'upcoming',
      source: 'Australian Taxation Office (ATO)',
      instrument: 'Taxation Administration Act 1953',
      dateAdded: '2024-09-01',
      reason: 'Required for all employers from first employee',
      description: 'Real-time payroll reporting system',
      urgency: 'medium',
      daysToComplete: 7
    },
    {
      id: 'planning',
      name: 'Planning Permit',
      status: 'pending',
      source: 'Yarra City Council',
      instrument: 'Planning and Environment Act 1987',
      dateAdded: '2024-09-01',
      reason: 'Commercial food preparation in residential zone',
      description: 'Local planning approval for business use',
      urgency: 'high',
      daysToComplete: 3
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missing': return 'bg-red-500'
      case 'incomplete': return 'bg-orange-500'
      case 'pending': return 'bg-yellow-500'
      case 'upcoming': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-200 bg-red-50/20'
      case 'high': return 'border-orange-200 bg-orange-50/20'
      case 'medium': return 'border-blue-200 bg-blue-50/20'
      case 'low': return 'border-gray-200 bg-gray-50/20'
      default: return 'border-gray-200 bg-gray-50/20'
    }
  }

  const regulators = [
    {
      level: 'Commonwealth',
      items: ['ATO', 'Fair Work', 'Federal Register']
    },
    {
      level: 'VIC',
      items: ['Dept of Health', 'EPA', 'OH&S']
    },
    {
      level: 'Local (Yarra)',
      items: ['Food business registration', 'outdoor dining', 'signage', 'waste']
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
              <h1 className="text-2xl font-bold">Business Obligations</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Updated Business Owner Persona Card */}
        <Card className="border-amber-200 bg-amber-50/20 mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  Cathy Cook
                  <Badge variant="outline" className="border-amber-300">Business Owner</Badge>
                  <Badge variant="secondary" className="bg-green-100 border-green-300">Updated Profile</Badge>
                </CardTitle>
                <div className="text-base mt-1 text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4" />
                    Catering Business
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Yarra Council, Victoria
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Regulators List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Regulators Relevant to Your Business
            </CardTitle>
            <CardDescription>
              Government bodies that oversee your catering business compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {regulators.map((regulator, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-primary">
                      {regulator.level}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {regulator.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-muted-foreground">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Obligations Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Business Obligations</CardTitle>
            <CardDescription>
              Including accepted obligations with detailed source information. Hover over items for more details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {obligations.map((obligation) => (
                <Card 
                  key={obligation.id}
                  className={`${getUrgencyColor(obligation.urgency)} transition-all duration-200 hover:shadow-md cursor-pointer`}
                  onMouseEnter={() => setHoveredObligation(obligation.id)}
                  onMouseLeave={() => setHoveredObligation(null)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(obligation.status)}`}></div>
                        <div>
                          <CardTitle className="text-base">{obligation.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {obligation.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {obligation.status}
                        </Badge>
                        <Badge 
                          variant={obligation.urgency === 'critical' ? 'destructive' : 'secondary'} 
                          className="text-xs"
                        >
                          {obligation.urgency}
                        </Badge>
                        {obligation.daysToComplete === 0 ? (
                          <Badge variant="destructive" className="text-xs">
                            Immediate
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {obligation.daysToComplete} days
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* Hover Details */}
                  {hoveredObligation === obligation.id && (
                    <CardContent className="pt-0 border-t bg-white/50">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">Source:</div>
                          <div className="flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {obligation.source}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">Legislative Instrument:</div>
                          <div>{obligation.instrument}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">Date Added:</div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {obligation.dateAdded}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">Why Included:</div>
                          <div className="flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {obligation.reason}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back to Compliance Services */}
        <Card className="bg-primary/5 mt-6">
          <CardHeader>
            <CardTitle>Need to Review Your Compliance Services?</CardTitle>
            <CardDescription>
              Return to the main compliance dashboard to explore other services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleBackToCompliance} 
              className="w-full" 
              size="lg"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Compliance Services Available
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}