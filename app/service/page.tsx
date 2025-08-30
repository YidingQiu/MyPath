'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '../../src/components/ui/button'
import { useState, useEffect, Suspense } from 'react'

function ServiceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  
  const serviceUrl = searchParams.get('url')
  const serviceName = searchParams.get('name')

  // Check if this is likely to be a blocked site
  const blockedDomains = [
    'my.gov.au',
    'servicesaustralia.gov.au', 
    'ato.gov.au',
    'aec.gov.au',
    'accc.gov.au'
  ]

  const isLikelyBlocked = serviceUrl && blockedDomains.some(domain => serviceUrl.includes(domain))

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!serviceUrl || !serviceName) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Service</h1>
          <p className="text-muted-foreground mb-4">Service URL or name is missing</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to MyPath
            </Button>
            <h1 className="text-lg font-semibold">{decodeURIComponent(serviceName)}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(serviceUrl, '_blank')}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading {decodeURIComponent(serviceName)}...</p>
          </div>
        </div>
      )}

      {/* Service iframe */}
      <div className="flex-1 relative">
        {isLikelyBlocked || isBlocked ? (
          <div className="h-full flex items-center justify-center bg-muted/10 p-8">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <ExternalLink className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Site Protection Active</h2>
                <p className="text-muted-foreground mb-6">
                  {decodeURIComponent(serviceName)} cannot be displayed within MyPath due to security restrictions. 
                  This is normal for secure government websites.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => window.open(serviceUrl, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open {decodeURIComponent(serviceName)} in New Tab
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to MyPath
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Secure government websites prevent embedding for your protection
              </p>
            </div>
          </div>
        ) : (
          <iframe
            src={serviceUrl}
            className={`w-full h-full border-none ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            title={`${serviceName} - Australian Government Service`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsBlocked(true)}
          />
        )}
      </div>

      {/* Footer Notice */}
      <footer className="bg-muted/30 p-3 text-center">
        <p className="text-sm text-muted-foreground">
          You are viewing an Australian Government service within MyPath. 
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => window.open(serviceUrl, '_blank')}
            className="p-0 ml-1 text-sm"
          >
            Open in new tab
          </Button>
        </p>
      </footer>
    </div>
  )
}

export default function ServicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service...</p>
        </div>
      </div>
    }>
      <ServiceContent />
    </Suspense>
  )
}