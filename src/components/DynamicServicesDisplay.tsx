'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  ExternalLink,
  Search,
  Database,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  Globe
} from 'lucide-react';
import type { Persona, Stage } from '../../app/page';

interface ServiceResult {
  url: string;
  title: string;
  serviceList: string;
  description: string;
}

interface SearchMetadata {
  source: 'cache' | 'hybrid';
  cacheHitCount?: number;
  webSearchCount?: number;
  totalSerpApiRequests?: number;
  searchTime?: number;
}

interface DynamicServicesDisplayProps {
  personas: Persona[];
  stage: Stage;
}

export function DynamicServicesDisplay({ personas, stage }: DynamicServicesDisplayProps) {
  const [services, setServices] = useState<ServiceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [metadata, setMetadata] = useState<SearchMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Generate default search query based on personas and stage
  const generateDefaultQuery = () => {
    const personaLabels: Record<Persona, string> = {
      citizen: 'general citizen services',
      newArrival: 'new arrival immigration services',
      student: 'student education services',
      worker: 'employment worker services',
      careerChanger: 'career change job transition services',
      parent: 'parenting family services',
      carer: 'carer support services',
      personWithDisability: 'disability support services',
      senior: 'senior elderly services',
      smbOwner: 'small business owner services',
      entrepreneur: 'entrepreneur business services',
      disasterAffected: 'disaster recovery support services',
      custom: 'general support services'
    };

    if (personas.length === 0) return 'general support services';
    
    const primaryPersona = personas[0];
    return personaLabels[primaryPersona] || 'general support services';
  };

  const searchServices = async (query?: string) => {
    if (!query) query = searchQuery || generateDefaultQuery();
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/discover-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: query,
          persona: personas[0] || 'citizen',
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setServices(data.services || []);
      setMetadata(data.metadata || null);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Service search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search on component mount
  useEffect(() => {
    if (personas.length > 0 && !hasSearched) {
      const defaultQuery = generateDefaultQuery();
      setSearchQuery(defaultQuery);
      searchServices(defaultQuery);
    }
  }, [personas, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchServices(searchQuery.trim());
    }
  };

  const handleServiceClick = (service: ServiceResult) => {
    // Open service URL in new tab
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  const getSourceIcon = () => {
    if (!metadata) return <Search className="w-4 h-4" />;
    
    switch (metadata.source) {
      case 'cache':
        return <Database className="w-4 h-4" />;
      case 'hybrid':
        return <Zap className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getSourceDescription = () => {
    if (!metadata) return 'Search results';
    
    switch (metadata.source) {
      case 'cache':
        return `Found ${metadata.cacheHitCount || 0} cached results in ${metadata.searchTime || 0}ms`;
      case 'hybrid':
        return `${metadata.cacheHitCount || 0} cached + ${metadata.webSearchCount || 0} new results`;
      default:
        return 'Search results';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">Discover Services</h2>
          {metadata && (
            <Badge variant="outline" className="flex items-center gap-1">
              {getSourceIcon()}
              {metadata.source === 'cache' ? 'Cached' : 'Live Search'}
            </Badge>
          )}
        </div>
        
        {/* Selected Personas */}
        <div className="flex flex-wrap gap-2 mb-4">
          {personas.map(persona => {
            const personaLabels: Record<Persona, string> = {
              citizen: 'Citizen/Resident',
              newArrival: 'New Arrival',
              student: 'Student/Learner',
              worker: 'Worker/Jobseeker',
              careerChanger: 'Career-changer',
              parent: 'Parent/Guardian',
              carer: 'Carer',
              personWithDisability: 'Person with Disability',
              senior: 'Senior/Retiree',
              smbOwner: 'SMB Owner',
              entrepreneur: 'Entrepreneur',
              disasterAffected: 'Disaster-affected',
              custom: 'Custom'
            };
            return (
              <Badge key={persona} variant="secondary">
                {personaLabels[persona]}
              </Badge>
            );
          })}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Describe your situation or what help you need..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !searchQuery.trim()}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </Button>
        </form>

        {/* Search Metadata */}
        {metadata && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              {getSourceIcon()}
              {getSourceDescription()}
            </div>
            {metadata.searchTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {metadata.searchTime}ms
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Search Error</span>
            </div>
            <p className="text-sm mt-1">{error}</p>
            <Button 
              onClick={() => searchServices()} 
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium mb-2">Discovering Services</p>
            <p className="text-sm text-muted-foreground">
              Searching our database and the web for relevant services...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Services Results */}
      {!loading && services.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium">
              Found {services.length} relevant services
            </span>
          </div>
          
          <div className="grid gap-4">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{service.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleServiceClick(service)}
                      variant="outline"
                      size="sm"
                      className="ml-4 flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Visit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {service.serviceList.split(',').map((item, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {item.trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {service.url.replace(/^https?:\/\//, '')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {!loading && hasSearched && services.length === 0 && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t find any services matching your search. Try adjusting your search terms or be more specific about your needs.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('general support services');
                searchServices('general support services');
              }}
              variant="outline"
            >
              Search for General Services
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Initial State - Before Search */}
      {!loading && !hasSearched && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Service Discovery</h3>
            <p className="text-muted-foreground mb-4">
              Our AI-powered system will find relevant services based on your situation. 
              Enter a specific question or problem above to get personalized recommendations.
            </p>
            <p className="text-sm text-muted-foreground">
              The system learns from previous searches to provide faster, more relevant results over time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}