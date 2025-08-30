'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../src/components/ui/card'
import { Badge } from '../../../../src/components/ui/badge'
import { Button } from '../../../../src/components/ui/button'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  MapPin,
  ArrowLeft,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Bell,
  Target,
  ArrowRight
} from 'lucide-react'
import { LogoImage } from '../../../../src/components/LogoImage'

export default function JobAdvicePage() {
  const router = useRouter()
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [showEnrollment, setShowEnrollment] = useState(false)

  const handleBackToSupport = () => {
    router.push('/loss-of-job/support')
  }

  const handleJobToggle = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const handleEnrollForJobs = () => {
    setShowEnrollment(true)
    // Simulate notification/toast
    setTimeout(() => {
      alert('✓ Task created! Job applications have been added to your Worker/Jobseeker persona dashboard.')
    }, 500)
  }

  const topJobs = [
    {
      id: 'retail',
      title: 'Retail Sales Associate',
      company: 'Various retailers',
      salary: '$25-30/hour',
      demand: 'High',
      growth: '+15%',
      description: 'Customer service, sales, inventory management'
    },
    {
      id: 'warehouse',
      title: 'Warehouse Operator',
      company: 'Logistics companies',
      salary: '$28-35/hour',
      demand: 'Very High',
      growth: '+22%',
      description: 'Order picking, packing, forklift operation'
    },
    {
      id: 'healthcare',
      title: 'Healthcare Support Worker',
      company: 'Aged care facilities',
      salary: '$30-38/hour',
      demand: 'Critical',
      growth: '+28%',
      description: 'Personal care, medication assistance, companionship'
    },
    {
      id: 'hospitality',
      title: 'Food Service Attendant',
      company: 'Restaurants & cafes',
      salary: '$24-28/hour',
      demand: 'High',
      growth: '+12%',
      description: 'Food preparation, customer service, cleaning'
    },
    {
      id: 'admin',
      title: 'Administrative Assistant',
      company: 'Office environments',
      salary: '$26-32/hour',
      demand: 'Moderate',
      growth: '+8%',
      description: 'Data entry, phone support, filing, scheduling'
    }
  ]

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'Very High': return 'bg-orange-100 text-orange-800'
      case 'High': return 'bg-green-100 text-green-800'
      case 'Moderate': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <LogoImage 
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold">Job Market Insights</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Market Overview */}
        <Card className="border-blue-200 bg-blue-50/30 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Local Job Market Analysis</CardTitle>
                <CardDescription className="text-blue-700">
                  Melbourne CBD & Inner Suburbs • Updated 2 hours ago
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">285</div>
                <div className="text-sm text-muted-foreground">Active Job Listings</div>
                <div className="text-xs text-green-600">↑ 18% from last month</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">73%</div>
                <div className="text-sm text-muted-foreground">Match Your Skills</div>
                <div className="text-xs text-blue-600">Based on your profile</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">$29</div>
                <div className="text-sm text-muted-foreground">Average Hourly Rate</div>
                <div className="text-xs text-purple-600">In your skill range</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Jobs List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Top Job Opportunities
              </CardTitle>
              <CardDescription>
                Based on location trends and your skill profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className={`cursor-pointer transition-all ${
                      selectedJobs.includes(job.id) 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleJobToggle(job.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{job.title}</CardTitle>
                            {selectedJobs.includes(job.id) && (
                              <CheckCircle className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <CardDescription className="text-sm">
                            {job.company}
                          </CardDescription>
                        </div>
                        <Badge className={getDemandColor(job.demand)} variant="secondary">
                          {job.demand}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-3 h-3" />
                            {job.growth}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {job.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Map & Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Job Locations & Commute
              </CardTitle>
              <CardDescription>
                Opportunities within your preferred travel distance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-100 h-40 rounded-lg relative overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50432.097885465385!2d144.92611!3d-37.8136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce600!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1698765432200!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Job Locations Map"
                    className="rounded-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">CBD & Inner Melbourne</span>
                    </div>
                    <div className="text-sm font-medium">125 jobs</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Eastern Suburbs</span>
                    </div>
                    <div className="text-sm font-medium">89 jobs</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Northern Suburbs</span>
                    </div>
                    <div className="text-sm font-medium">71 jobs</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Commute Insight</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average commute time: 28 minutes by public transport, 22 minutes by car
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Application Enrollment */}
        {selectedJobs.length > 0 && (
          <Card className="border-primary bg-primary/5 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ready to Apply?
              </CardTitle>
              <CardDescription>
                You've selected {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} to pursue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedJobs.map(jobId => {
                    const job = topJobs.find(j => j.id === jobId)
                    return (
                      <Badge key={jobId} variant="secondary" className="bg-primary/10">
                        {job?.title}
                      </Badge>
                    )
                  })}
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">What happens next:</p>
                      <ul className="text-sm text-amber-700 mt-1 space-y-1">
                        <li>• Job application tasks will be created in your Worker/Jobseeker dashboard</li>
                        <li>• You'll receive notifications about application deadlines</li>
                        <li>• Resume templates will be customized for each role</li>
                        <li>• Interview preparation materials will be provided</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleEnrollForJobs} 
                  className="w-full" 
                  variant="outline"
                  size="lg"
                  disabled={showEnrollment}
                >
                  {showEnrollment ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tasks Created Successfully!
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Enroll to Apply for Selected Jobs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Industry Insights
            </CardTitle>
            <CardDescription>
              Key trends affecting your job search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Growing Sectors</h4>
                    <p className="text-sm text-green-700">Healthcare, logistics, and tech support seeing 20%+ growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Hiring Speed</h4>
                    <p className="text-sm text-blue-700">Most positions filled within 2-3 weeks of posting</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Skills in Demand</h4>
                    <p className="text-sm text-purple-700">Customer service, digital literacy, teamwork highly valued</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Best Application Times</h4>
                    <p className="text-sm text-amber-700">Tuesday-Thursday mornings show highest response rates</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Journey */}
        <Card className="bg-accent/20">
          <CardHeader>
            <CardTitle>Continue Your Support Journey</CardTitle>
            <CardDescription>
              Access additional resources and support services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackToSupport} className="w-full" size="lg">
              Return to Support Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}