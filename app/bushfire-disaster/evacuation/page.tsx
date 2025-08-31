'use client'

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Shield,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LogoImage } from '../../../src/components/LogoImage'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'
import { Alert, AlertDescription } from '../../../src/components/ui/alert'

export default function EvacuationPage() {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push('/bushfire-disaster/dashboard')
  }

  const handleArrivedClick = () => {
    router.push('/bushfire-disaster/relief')
  }

  const handleRecoveryClick = () => {
    router.push('/bushfire-disaster/recovery')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert Banner */}
      <div className="bg-red-600 text-white p-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-semibold">ACTIVE BUSHFIRE EMERGENCY • EVACUATE NOW</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
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
              <h1 className="text-2xl font-bold">Evacuation Guidance</h1>
            </div>
          </div>
          <div className="text-sm opacity-90 hidden md:block">
            Emergency evacuation support
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Recommended Evacuation Center */}
        <div className="mb-6">
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Nearest Evacuation Centre
              </CardTitle>
              <CardDescription>
                Recommended option based on your location and current conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Map */}
                <div className="bg-blue-100 h-64 rounded-lg relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8385385572983!2d144.9537363153168!3d-37.77462397975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2s482-490%20Racecourse%20Rd%2C%20Flemington%20VIC%203031%2C%20Australia!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Evacuation Route"
                    className="rounded-lg"
                  />
                </div>
                
                {/* Center Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <div className="font-bold text-lg">Flemington Community Centre</div>
                      <div className="text-muted-foreground">482-490 Racecourse Road, Flemington VIC 3031</div>
                      <div className="text-green-600 font-medium">4.2km away • 8 minute drive</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <div className="font-medium">Emergency Contact</div>
                      <div className="text-muted-foreground">(03) 9376 4500</div>
                      <div className="text-blue-600 font-medium">CALL FIRST before traveling</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-500 mt-1" />
                    <div>
                      <div className="font-medium">Capacity Status</div>
                      <div className="text-muted-foreground">Currently accepting evacuees</div>
                      <div className="text-amber-600 font-medium">47% capacity • Space available</div>
                    </div>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>Important:</strong> Call the center before traveling to confirm availability and get current directions.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Travel Safety */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Travel Safety Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Take essential documents (ID, insurance papers)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Bring medications and personal items</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Keep radio on for updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Close all doors and windows before leaving</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Tell family/friends where you&apos;re going</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Alternative Centers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">Moonee Valley Civic Centre</div>
                  <div className="text-sm text-muted-foreground">6.8km away • (03) 9243 8888</div>
                  <div className="text-amber-600 text-sm">89% capacity</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">Essendon North Primary School</div>
                  <div className="text-sm text-muted-foreground">5.2km away • (03) 9337 4111</div>
                  <div className="text-red-600 text-sm">Full capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={handleArrivedClick}>
            <ArrowRight className="w-4 h-4 mr-2" />
            I&apos;ve Arrived Safely
          </Button>
          <Button size="lg" variant="outline" onClick={handleRecoveryClick}>
            <Users className="w-4 h-4 mr-2" />
            View Emergency Relief Services
          </Button>
        </div>
      </div>
    </div>
  )
}