'use client'

import {
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    FileText,
    MapPin,
    Shield,
    User
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogoImage } from '../../../../src/components/LogoImage'
import { Badge } from '../../../../src/components/ui/badge'
import { Button } from '../../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../src/components/ui/card'

export default function EligibilityPage() {
  const router = useRouter()
  const [showRegistration, setShowRegistration] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: ''
  })

  const handleBackToSupport = () => {
    router.push('/loss-of-job/support')
  }

  const handleRegister = () => {
    setShowRegistration(true)
    // Show AI assistant after a brief delay
    setTimeout(() => setShowAIAssistant(true), 1000)
  }

  const handleAIAssist = () => {
    setShowBiometric(true)
    setShowAIAssistant(false)
  }

  const handleBiometricAuth = () => {
    // Simulate biometric authentication
    setShowBiometric(false)
    // Auto-fill with Joe Jobs' information
    setFormData({
      firstName: 'Joe',
      lastName: 'Jobs',
      dateOfBirth: '2020-08-29',
      phone: '0404 000 001',
      email: 'J.Jobs@email.com',
      address: '1+2i Lewis St, Flemington VIC 3031'
    })
  }

  const handleRegistrationComplete = () => {
    router.push('/loss-of-job/support/preparation')
  }

  const eligibilityRules = [
    { rule: "Unemployed or working less than 25 hours per week", status: "✓ Met", color: "text-green-600" },
    { rule: "Australian resident or eligible visa holder", status: "✓ Met", color: "text-green-600" },
    { rule: "Between 22 and Age Pension age", status: "✓ Met", color: "text-green-600" },
    { rule: "Income below $2,340 per fortnight", status: "✓ Likely Met", color: "text-green-600" },
    { rule: "Assets below threshold ($268,000 single)", status: "? To Verify", color: "text-amber-600" },
    { rule: "Willing to look for work", status: "✓ Met", color: "text-green-600" }
  ]

  if (showRegistration) {
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
                <h1 className="text-2xl font-bold">Application Registration</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Complete Your Application
              </CardTitle>
              <CardDescription>
                Register for JobSeeker Payment assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative">
                {/* AI Assistant Popup */}
                {showAIAssistant && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative">
                          <Image 
                            src="/MyPath.png" 
                            alt="MyPath AI" 
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                          {/* Smiley eyes overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-8 h-8">
                              <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"></div>
                              <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold">AI Assistant</h3>
                          <p className="text-sm text-muted-foreground">MyPath Helper</p>
                        </div>
                      </div>
                      <p className="text-sm mb-4">
                        &quot;Let me do it for you! I can securely auto-fill your information using your verified identity.&quot;
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={handleAIAssist} className="flex-1">
                          Yes, Help Me
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAIAssistant(false)}
                          className="flex-1"
                        >
                          No Thanks
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Biometric Authentication Popup */}
                {showBiometric && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm mx-4 shadow-xl text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        {/* Fingerprint icon for mobile/narrow screens, Face ID for wider screens */}
                        <div className="block md:hidden">
                          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white">
                            <path fill="currentColor" d="M17.81,4.47C17.73,4.47 17.65,4.45 17.58,4.41L17.58,4.41C17.5,4.38 17.42,4.37 17.33,4.39C17.25,4.4 17.17,4.43 17.1,4.47C17.03,4.5 16.97,4.55 16.91,4.6C16.86,4.65 16.81,4.71 16.77,4.77C16.73,4.84 16.7,4.91 16.68,4.98C16.65,5.05 16.64,5.13 16.64,5.2C16.64,5.27 16.65,5.35 16.68,5.42C16.7,5.49 16.73,5.56 16.77,5.63C16.81,5.69 16.86,5.75 16.91,5.8C16.97,5.85 17.03,5.9 17.1,5.93C17.17,5.97 17.25,6 17.33,6C17.42,6 17.5,6 17.58,5.97L17.58,5.97C17.65,5.95 17.73,5.93 17.81,5.9C17.88,5.87 17.95,5.83 18.02,5.78C18.08,5.73 18.13,5.68 18.18,5.62C18.22,5.56 18.26,5.49 18.28,5.42C18.31,5.35 18.32,5.27 18.32,5.2C18.32,5.13 18.31,5.05 18.28,4.98C18.26,4.91 18.22,4.84 18.18,4.78C18.13,4.72 18.08,4.67 18.02,4.62C17.95,4.57 17.88,4.53 17.81,4.5"/>
                            <path fill="currentColor" d="M12,23C10.8,23 9.79,22.71 8.97,22.14C8.14,21.56 7.5,20.75 7.04,19.71C6.58,18.67 6.35,17.47 6.35,16.1C6.35,14.73 6.58,13.53 7.04,12.49C7.5,11.45 8.14,10.64 8.97,10.06C9.79,9.49 10.8,9.2 12,9.2C13.2,9.2 14.21,9.49 15.03,10.06C15.86,10.64 16.5,11.45 16.96,12.49C17.42,13.53 17.65,14.73 17.65,16.1C17.65,17.47 17.42,18.67 16.96,19.71C16.5,20.75 15.86,21.56 15.03,22.14C14.21,22.71 13.2,23 12,23M12,11.2C11.2,11.2 10.56,11.42 10.06,11.85C9.56,12.29 9.19,12.87 8.96,13.6C8.73,14.32 8.61,15.14 8.61,16.05C8.61,16.96 8.73,17.78 8.96,18.5C9.19,19.23 9.56,19.81 10.06,20.25C10.56,20.68 11.2,20.9 12,20.9C12.8,20.9 13.44,20.68 13.94,20.25C14.44,19.81 14.81,19.23 15.04,18.5C15.27,17.78 15.39,16.96 15.39,16.05C15.39,15.14 15.27,14.32 15.04,13.6C14.81,12.87 14.44,12.29 13.94,11.85C13.44,11.42 12.8,11.2 12,11.2Z"/>
                          </svg>
                        </div>
                        <div className="hidden md:block">
                          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white">
                            <path fill="currentColor" d="M17.81,4.47C17.73,4.47 17.65,4.45 17.58,4.41C17.5,4.38 17.77,4.56 17.81,4.47M17.81,4.47C17.81,4.47 17.8,4.47 17.79,4.47C17.79,4.47 17.81,4.47 17.81,4.47M17.81,4.47C17.81,4.47 17.81,4.47 17.81,4.47C17.81,4.47 17.81,4.47 17.81,4.47M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,13L13.5,7H10.5L9,13L3,7V9L9,15L10.5,9H13.5L15,15L21,9Z"/>
                          </svg>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">Verify Your Identity</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        <span className="block md:hidden">Touch the fingerprint sensor to securely access your information</span>
                        <span className="hidden md:block">Use Face ID or fingerprint to securely access your information</span>
                      </p>
                      <Button 
                        onClick={handleBiometricAuth}
                        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                      >
                        <div className="block md:hidden">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                            <path fill="currentColor" d="M17.81,4.47C17.73,4.47 17.65,4.45 17.58,4.41L17.58,4.41C17.5,4.38 17.42,4.37 17.33,4.39C17.25,4.4 17.17,4.43 17.1,4.47C17.03,4.5 16.97,4.55 16.91,4.6C16.86,4.65 16.81,4.71 16.77,4.77C16.73,4.84 16.7,4.91 16.68,4.98C16.65,5.05 16.64,5.13 16.64,5.2C16.64,5.27 16.65,5.35 16.68,5.42C16.7,5.49 16.73,5.56 16.77,5.63C16.81,5.69 16.86,5.75 16.91,5.8C16.97,5.85 17.03,5.9 17.1,5.93C17.17,5.97 17.25,6 17.33,6C17.42,6 17.5,6 17.58,5.97L17.58,5.97C17.65,5.95 17.73,5.93 17.81,5.9C17.88,5.87 17.95,5.83 18.02,5.78C18.08,5.73 18.13,5.68 18.18,5.62C18.22,5.56 18.26,5.49 18.28,5.42C18.31,5.35 18.32,5.27 18.32,5.2C18.32,5.13 18.31,5.05 18.28,4.98C18.26,4.91 18.22,4.84 18.18,4.78C18.13,4.72 18.08,4.67 18.02,4.62C17.95,4.57 17.88,4.53 17.81,4.5"/>
                          </svg>
                        </div>
                        <div className="hidden md:block">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                            <path fill="currentColor" d="M17.81,4.47C17.73,4.47 17.65,4.45 17.58,4.41C17.5,4.38 17.77,4.56 17.81,4.47M17.81,4.47C17.81,4.47 17.8,4.47 17.79,4.47C17.79,4.47 17.81,4.47 17.81,4.47M17.81,4.47C17.81,4.47 17.81,4.47 17.81,4.47C17.81,4.47 17.81,4.47 17.81,4.47M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,13L13.5,7H10.5L9,13L3,7V9L9,15L10.5,9H13.5L15,15L21,9Z"/>
                          </svg>
                        </div>
                        Authenticate
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-2 border rounded-md h-20"
                    placeholder="Enter your full address"
                  />
                </div>

                <Button 
                  onClick={handleRegistrationComplete}
                  className="w-full"
                  size="lg"
                >
                  Complete Registration
                </Button>
              </div>
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
              <h1 className="text-2xl font-bold">Eligibility Assessment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Eligibility Summary */}
        <div className="mb-6">
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">JobSeeker Payment Eligible</CardTitle>
                    <CardDescription className="text-green-700">
                      83% confidence based on policy data
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">≈ $916</div>
                  <div className="text-sm text-green-600">per fortnight if approved</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Eligibility Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Eligibility Breakdown
              </CardTitle>
              <CardDescription>
                How you match against JobSeeker criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eligibilityRules.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">{item.rule}</span>
                    <Badge variant="outline" className={item.color}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Service Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Recommended Service Centre
              </CardTitle>
              <CardDescription>
                In-person meeting recommended due to technology comfort preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-100 h-32 rounded-lg relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8385385572983!2d144.9537363153168!3d-37.77462397975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2s482-490%20Racecourse%20Rd%2C%20Flemington%20VIC%203031%2C%20Australia!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Service Centre Location"
                    className="rounded-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-500 mt-1" />
                    <div>
                      <div className="font-medium">Newmarket Service Centre</div>
                      <div className="text-sm text-muted-foreground">482-490 Racecourse Road, Flemington VIC 3031</div>
                      <div className="text-sm text-blue-600">0.8km away • Open 8:30am-4:30pm</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <div className="font-medium">Recommended Appointment</div>
                      <div className="text-sm text-muted-foreground">Tuesday 10:00am or Wednesday 2:00pm</div>
                      <div className="text-sm text-green-600">Lower wait times</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Estimated Payment Details
            </CardTitle>
            <CardDescription>
              Breakdown based on current rates and your situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Base JobSeeker Payment</span>
                  <span className="font-medium">$745.20</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy Supplement</span>
                  <span className="font-medium">$17.60</span>
                </div>
                <div className="flex justify-between">
                  <span>Rent Assistance (estimated)</span>
                  <span className="font-medium">$153.40</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total per fortnight</span>
                  <span className="text-green-600">$916.20</span>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Important Notes</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Payments subject to income and asset testing</li>
                  <li>• Rent assistance based on estimated rent costs</li>
                  <li>• Must meet mutual obligation requirements</li>
                  <li>• Regular reporting required</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle>Ready to Apply?</CardTitle>
            <CardDescription>
              Start your application process with a personalized assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRegister} size="lg" className="w-full">
              <User className="w-4 h-4 mr-2" />
              Register for Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}