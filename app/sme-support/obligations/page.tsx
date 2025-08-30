'use client'

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Network,
  Package
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogoImage } from '../../../src/components/LogoImage'
import { updateWorkflowState } from '../workflow-state'
import { Badge } from '../../../src/components/ui/badge'
import { Button } from '../../../src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card'

export default function ObligationsPage() {
  const router = useRouter()
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false)

  useEffect(() => {
    // Mark assessment as completed when user views this page
    updateWorkflowState({ assessmentCompleted: true });
  }, []);

  const handleBack = () => {
    router.push('/sme-support/compliance')
  }

  const handleBundle = () => {
    router.push('/sme-support/bundles')
  }

  const openGraphModal = () => {
    setIsGraphModalOpen(true)
  }

  const closeGraphModal = () => {
    setIsGraphModalOpen(false)
  }

  const priorityItems = {
    duplicatesConflicts: [
      { name: 'Food Safety Program vs Food Safety Supervisor', type: 'duplicate' }
    ],
    critical: [
      { name: 'ABN', status: 'missing', days: 0 },
      { name: 'Food premises registration', status: 'missing', days: 0 },
      { name: 'Public liability insurance', status: 'missing', days: 0 }
    ],
    high: [
      { name: 'PAYG Withholding', status: 'incomplete', days: 1 },
      { name: 'GST Registration', status: 'incomplete', days: 2 },
      { name: 'Food safety supervisor', status: 'missing', days: 3 },
      { name: 'Planning Permit', status: 'pending', days: 3 }
    ],
    medium: [
      { name: 'Single Touch Payroll', status: 'upcoming', days: 7 },
      { name: 'Trade waste consent', status: 'upcoming', days: 10 },
      { name: 'Work Cover Insurance', status: 'upcoming', days: 14 }
    ],
    low: [
      { name: 'Business name registration', status: 'optional', days: 21 },
      { name: 'Outdoor dining permit', status: 'optional', days: 28 },
      { name: 'Signage permit', status: 'optional', days: 30 }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missing': return 'bg-red-500'
      case 'incomplete': return 'bg-orange-500'
      case 'pending': return 'bg-yellow-500'
      case 'upcoming': return 'bg-blue-500'
      case 'optional': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'missing': return 'Missing'
      case 'incomplete': return 'Incomplete'
      case 'pending': return 'Pending'
      case 'upcoming': return 'Upcoming'
      case 'optional': return 'Optional'
      default: return status
    }
  }

  const ObligationItem = ({ item, priority }: { item: any, priority: string }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
        <div>
          <div className="font-medium text-sm">{item.name}</div>
          {item.days !== undefined && (
            <div className="text-xs text-muted-foreground">
              {item.days === 0 ? 'Immediate' : `${item.days} days`}
            </div>
          )}
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        {item.status ? getStatusText(item.status) : item.type}
      </Badge>
    </div>
  )

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
        {/* Obligation Graph */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Your Obligation Graph</CardTitle>
                <CardDescription>
                  Visual map of compliance requirements and dependencies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg border border-blue-200 p-4 overflow-hidden">
              <div 
                className="relative cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
                onClick={openGraphModal}
                title="Click to view full-size graph"
              >
                <img 
                  src="/sme-support/obligation-graph.png" 
                  alt="Business Obligation Graph"
                  className="w-full h-auto object-contain"
                  style={{ 
                    maxHeight: '350px', 
                    minHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                  <div className="bg-white/90 px-3 py-1 rounded text-sm font-medium">
                    Click to enlarge
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Sections */}
        <div className="space-y-6 mb-6">
          {/* Duplicates & Conflicts */}
          {priorityItems.duplicatesConflicts.length > 0 && (
            <Card className="border-purple-200 bg-purple-50/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <AlertTriangle className="w-5 h-5" />
                  Duplicates & Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {priorityItems.duplicatesConflicts.map((item, index) => (
                  <ObligationItem key={index} item={item} priority="duplicate" />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Critical */}
          <Card className="border-red-200 bg-red-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Critical Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityItems.critical.map((item, index) => (
                <ObligationItem key={index} item={item} priority="critical" />
              ))}
            </CardContent>
          </Card>

          {/* High Priority */}
          <Card className="border-orange-200 bg-orange-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Clock className="w-5 h-5" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityItems.high.map((item, index) => (
                <ObligationItem key={index} item={item} priority="high" />
              ))}
            </CardContent>
          </Card>

          {/* Medium Priority */}
          <Card className="border-blue-200 bg-blue-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Calendar className="w-5 h-5" />
                Medium Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityItems.medium.map((item, index) => (
                <ObligationItem key={index} item={item} priority="medium" />
              ))}
            </CardContent>
          </Card>

          {/* Low Priority */}
          <Card className="border-gray-200 bg-gray-50/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5" />
                Low Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityItems.low.map((item, index) => (
                <ObligationItem key={index} item={item} priority="low" />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bundle Action */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Ready to Create Process Bundles?
            </CardTitle>
            <CardDescription>
              Group related obligations into manageable workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleBundle} 
              className="w-full" 
              size="lg"
            >
              Bundle
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Graph Modal */}
        {isGraphModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={closeGraphModal}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl max-w-7xl max-h-[90vh] w-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Business Obligation Graph</h3>
                <button 
                  onClick={closeGraphModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <img 
                  src="/sme-support/obligation-graph.png" 
                  alt="Business Obligation Graph"
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: 'calc(90vh - 120px)' }}
                />
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <button 
                  onClick={closeGraphModal}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}