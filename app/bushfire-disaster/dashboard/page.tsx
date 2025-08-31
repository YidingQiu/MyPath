'use client'

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'
import { Alert, AlertDescription } from '../../../src/components/ui/alert'

export default function BushfireDashboardPage() {
  const router = useRouter()

  const handleBackToBushfire = () => {
    router.push('/bushfire-disaster')
  }

  const handleEvacuateClick = () => {
    router.push('/bushfire-disaster/evacuation')
  }

  const handleReliefClick = () => {
    router.push('/bushfire-disaster/relief')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert Banner */}
      <div className="bg-red-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <Alert className="border-red-700 bg-red-600 text-white">
            <AlertTriangle className="h-5 w-5 text-white" />
            <AlertDescription className="text-white font-semibold text-lg">
              🚨 EMERGENCY ALERT: There is an active bushfire within 18 km of your location. Immediate action recommended.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToBushfire}
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
              <h1 className="text-2xl font-bold">Emergency Dashboard</h1>
            </div>
          </div>
          <div className="text-sm opacity-90 hidden md:block">
            Bushfire Emergency Response
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Persona Detection */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Personalized Emergency Response</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-red-50 border-red-200">
              Persona: Affected by natural disaster (bushfire)
            </Badge>
            <Badge variant="outline" className="bg-amber-50 border-amber-200">
              Emergency Level: High
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Your safety is our priority. We&apos;ve detected an emergency situation and recommend immediate evacuation.
          </p>
        </div>

        {/* Emergency Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Evacuation Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg border-red-200 bg-red-50/30"
            onClick={handleEvacuateClick}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Recommended Action: EVACUATE</CardTitle>
                  <CardDescription>
                    Get to safety immediately
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">URGENT</div>
                  <div className="text-sm text-red-600">Leave now</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Nearest evacuation center: 4.2km away</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Get evacuation route, center contact details, and safety instructions.
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Get Evacuation Guidance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Services Card */}
          <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Emergency Services</CardTitle>
                  <CardDescription>
                    Immediate emergency contacts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="bg-red-50 border-red-200">
                    <Phone className="w-4 h-4 mr-2" />
                    000
                  </Button>
                  <Button variant="outline" className="bg-orange-50 border-orange-200">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    132 500
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  000 for life-threatening emergencies • 132 500 for SES assistance
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Conditions */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Current Emergency Conditions</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Fire Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-bold text-red-600">Watch and Act</div>
                <div className="text-sm text-muted-foreground">
                  Bushfire within 18km • Wind: 45km/h NW • Temperature: 38°C
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Air Quality</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-bold text-orange-600">Hazardous</div>
                <div className="text-sm text-muted-foreground">
                  Air pollution: 2,100 • Stay indoors if not evacuating
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-base">Road Closures</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-lg font-bold text-amber-600">3 Active</div>
                <div className="text-sm text-muted-foreground">
                  M80 Western Ring Road • Calder Highway • Western Freeway
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-amber-50/50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              After you reach a safe evacuation center, you&apos;ll gain access to emergency relief support services to help with your immediate and ongoing needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleReliefClick} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                View Emergency Relief Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}