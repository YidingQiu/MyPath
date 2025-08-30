'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { Badge } from '../../src/components/ui/badge';
import { Checkbox } from '../../src/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/ui/tabs';
import { 
  Search, 
  Database, 
  MapPin, 
  Building, 
  Tag, 
  Calendar,
  ExternalLink,
  Download,
  FileText,
  BarChart3,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Globe,
  Zap
} from 'lucide-react';

interface DatasetResult {
  id: string;
  title: string;
  description: string;
  organization: string;
  tags: string[];
  serviceDomains: string[];
  spatialCoverage?: string;
  temporalRange?: {
    from?: string;
    to?: string;
  };
  resources: Array<{
    name: string;
    format: string;
    url: string;
    size?: number;
  }>;
  license: string;
  relevanceScore: number;
  datasetUrl: string;
}

interface SearchAnalytics {
  totalCached: number;
  filteredCount: number;
  searchTime: number;
  filterBreakdown: {
    domainMatches: number;
    spatialMatches: number;
    organizationMatches: number;
    tagMatches: number;
  };
  averageSimilarity: number;
}

// Service domains for filtering
const SERVICE_DOMAINS = [
  'Identity & Status',
  'Income, Work & Enterprise', 
  'Education & Skills',
  'Health & Wellbeing',
  'Family & Care',
  'Housing & Utilities',
  'Mobility & Transport',
  'Civic & Community',
  'Safety, Justice & Consumer',
  'Environment, Hazards & Recovery',
  'Taxes & Money',
  'Licensing & Compliance',
  'Digital Life & Security',
  'Research & Data Access',
  'Aging, Retirement & Legacy'
];

const AUSTRALIAN_LOCATIONS = [
  'ACT', 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'NT', 'TAS', 'Australia'
];

export default function DatasetDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [datasets, setDatasets] = useState<DatasetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  
  // Filter states
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Population state
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationProgress, setPopulationProgress] = useState<string>('');

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dataset-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search',
          query: searchQuery,
          serviceDomains: selectedDomains,
          spatialFilter: selectedLocation || undefined,
          organizationFilter: selectedOrganization || undefined,
          tagsFilter: selectedTags,
          maxResults: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setDatasets(data.results);
        setAnalytics(data.analytics);
      } else {
        throw new Error(data.error || 'Search failed');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Dataset search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateDatasets = async () => {
    setIsPopulating(true);
    setPopulationProgress('Starting dataset population...');

    try {
      const response = await fetch('/api/dataset-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'populate',
          maxDatasets: 500, // Limit for demo
          batchSize: 50
        })
      });

      if (!response.ok) {
        throw new Error(`Population failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPopulationProgress(`✅ Population complete: ${data.stats.totalStored} datasets stored`);
      } else {
        throw new Error(data.error || 'Population failed');
      }

    } catch (err) {
      setPopulationProgress(`❌ Population failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsPopulating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Database className="w-8 h-8" />
            Government Dataset Discovery
          </h1>
          <p className="text-primary-foreground/80">
            Discover and explore Australian government datasets with AI-powered search
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Datasets
            </TabsTrigger>
            <TabsTrigger value="populate" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Populate Cache
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <div className="space-y-6">
              {/* Search Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Dataset Search
                  </CardTitle>
                  <CardDescription>
                    Search through government datasets using AI similarity matching and smart filters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      placeholder="e.g. housing assistance, employment data, health statistics..."
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

                  {/* Filters */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Service Domains Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Service Domains</label>
                      <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
                        {SERVICE_DOMAINS.map(domain => (
                          <div key={domain} className="flex items-center space-x-2">
                            <Checkbox
                              id={domain}
                              checked={selectedDomains.includes(domain)}
                              onCheckedChange={() => toggleDomain(domain)}
                            />
                            <label htmlFor={domain} className="text-xs cursor-pointer">
                              {domain}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <select 
                        value={selectedLocation} 
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">All Locations</option>
                        {AUSTRALIAN_LOCATIONS.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Organization Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Organization</label>
                      <Input
                        placeholder="e.g. Treasury, Health, Education"
                        value={selectedOrganization}
                        onChange={(e) => setSelectedOrganization(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(selectedDomains.length > 0 || selectedLocation || selectedOrganization) && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium">Active Filters:</span>
                      {selectedDomains.map(domain => (
                        <Badge key={domain} variant="secondary" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                      {selectedLocation && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {selectedLocation}
                        </Badge>
                      )}
                      {selectedOrganization && (
                        <Badge variant="outline" className="text-xs">
                          <Building className="w-3 h-3 mr-1" />
                          {selectedOrganization}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Search Analytics */}
              {analytics && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        {analytics.totalCached} total datasets
                      </div>
                      <div className="flex items-center gap-1">
                        <Filter className="w-4 h-4" />
                        {analytics.filteredCount} after filtering
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {analytics.searchTime}ms
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {(analytics.averageSimilarity * 100).toFixed(1)}% avg similarity
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <Card className="border-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Search Error</span>
                    </div>
                    <p className="text-sm mt-1">{error}</p>
                  </CardContent>
                </Card>
              )}

              {/* Search Results */}
              {datasets.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-bold">
                      Found {datasets.length} Relevant Datasets
                    </h2>
                  </div>

                  {datasets.map((dataset, index) => (
                    <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 leading-tight">
                              {dataset.title}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-3">
                              {dataset.description}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="default" className="text-xs">
                              {(dataset.relevanceScore * 100).toFixed(0)}% match
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">Organization:</span>
                              <span>{dataset.organization}</span>
                            </div>
                            {dataset.spatialCoverage && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Coverage:</span>
                                <span>{dataset.spatialCoverage}</span>
                              </div>
                            )}
                            {dataset.temporalRange?.from && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">Period:</span>
                                <span>
                                  {new Date(dataset.temporalRange.from).getFullYear()}
                                  {dataset.temporalRange.to && 
                                    ` - ${new Date(dataset.temporalRange.to).getFullYear()}`
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-xs block mb-1">License:</span>
                              <span className="text-xs">{dataset.license}</span>
                            </div>
                            <div>
                              <span className="font-medium text-xs block mb-1">Resources:</span>
                              <span className="text-xs">{dataset.resources.length} files</span>
                            </div>
                          </div>
                        </div>

                        {/* Service Domains */}
                        {dataset.serviceDomains.length > 0 && (
                          <div>
                            <span className="text-xs font-medium block mb-2">Service Domains:</span>
                            <div className="flex flex-wrap gap-1">
                              {dataset.serviceDomains.map(domain => (
                                <Badge key={domain} variant="outline" className="text-xs">
                                  {domain}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {dataset.tags.length > 0 && (
                          <div>
                            <span className="text-xs font-medium block mb-2">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                              {dataset.tags.slice(0, 8).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {dataset.tags.length > 8 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{dataset.tags.length - 8} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Resources */}
                        <div>
                          <span className="text-xs font-medium block mb-2">Available Resources:</span>
                          <div className="space-y-1">
                            {dataset.resources.slice(0, 3).map((resource, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  <span className="font-medium">{resource.format}</span>
                                  <span className="text-muted-foreground">
                                    {resource.name.length > 40 
                                      ? resource.name.substring(0, 40) + '...'
                                      : resource.name
                                    }
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {resource.size && (
                                    <span className="text-muted-foreground">
                                      {formatFileSize(resource.size)}
                                    </span>
                                  )}
                                  <Button size="sm" variant="ghost" asChild>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                      <Download className="w-3 h-3" />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {dataset.resources.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{dataset.resources.length - 3} more resources
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={dataset.datasetUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View on data.gov.au
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && datasets.length === 0 && searchQuery && !error && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Datasets Found</h3>
                    <p className="text-muted-foreground mb-4">
                      No datasets match your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSelectedDomains([]);
                      setSelectedLocation('');
                      setSelectedOrganization('');
                      setSelectedTags([]);
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="populate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Populate Dataset Cache
                </CardTitle>
                <CardDescription>
                  Download and process datasets from data.gov.au to enable fast search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This will fetch datasets from the Australian government data portal and process them for vector search. 
                  This may take a few minutes.
                </p>
                
                <Button 
                  onClick={populateDatasets} 
                  disabled={isPopulating}
                  className="w-full"
                >
                  {isPopulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Populating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Start Population
                    </>
                  )}
                </Button>

                {populationProgress && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{populationProgress}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  System Analytics
                </CardTitle>
                <CardDescription>
                  Monitor dataset cache performance and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analytics will be displayed here once you populate the dataset cache.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}