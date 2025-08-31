'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  MapPin, 
  Building, 
  Tag, 
  ChevronRight,
  TrendingUp,
  Layers,
  Globe,
  Zap,
  Eye,
  ArrowRight
} from 'lucide-react';
import { 
  PRESET_EXAMPLES, 
  EXAMPLES_BY_CATEGORY, 
  applyExample, 
  type DatasetExample 
} from '../../app/lib/dataset-examples';

interface DatasetExamplesProps {
  onApplyExample: (example: DatasetExample) => void;
  currentQuery: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function DatasetExamples({ 
  onApplyExample, 
  currentQuery, 
  isVisible, 
  onToggleVisibility 
}: DatasetExamplesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'popular' | 'domain' | 'location' | 'advanced'>('popular');

  if (!isVisible) {
    return (
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleVisibility}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Show Example Searches
        </Button>
      </div>
    );
  }

  const ExampleCard = ({ example }: { example: DatasetExample }) => {
    const IconComponent = example.icon;
    
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
        onClick={() => onApplyExample(example)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {example.title}
                </h4>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {example.description}
              </p>
              
              {/* Preview of what will be applied */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Query:</span> "{example.query.substring(0, 40)}..."
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {example.serviceDomains.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Layers className="w-3 h-3 mr-1" />
                      {example.serviceDomains.length === 1 
                        ? example.serviceDomains[0].split(' ')[0] + '...'
                        : `${example.serviceDomains.length} domains`
                      }
                    </Badge>
                  )}
                  
                  {example.location && (
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {example.location}
                    </Badge>
                  )}
                  
                  {example.organization && (
                    <Badge variant="outline" className="text-xs">
                      <Building className="w-3 h-3 mr-1" />
                      {example.organization}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-green-600 mt-1">
                  <Eye className="w-3 h-3 inline mr-1" />
                  {example.expectedResults.substring(0, 50)}...
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Example Searches</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleVisibility}
          className="text-muted-foreground"
        >
          Hide Examples
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-sm">
            Try these curated examples to explore Australian government datasets. 
            Each example will automatically fill in the search query and relevant filters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="popular" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="domain" className="text-xs">
                <Layers className="w-3 h-3 mr-1" />
                By Domain
              </TabsTrigger>
              <TabsTrigger value="location" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                By Location
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="mt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {EXAMPLES_BY_CATEGORY.popular.map(example => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Most commonly searched government datasets
              </p>
            </TabsContent>

            <TabsContent value="domain" className="mt-0">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {EXAMPLES_BY_CATEGORY.domain.map(example => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Examples showcasing different service domains
              </p>
            </TabsContent>

            <TabsContent value="location" className="mt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {EXAMPLES_BY_CATEGORY.location.map(example => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                State and territory specific dataset examples
              </p>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <div className="grid gap-3">
                {EXAMPLES_BY_CATEGORY.advanced.map(example => (
                  <ExampleCard key={example.id} example={example} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Complex queries demonstrating advanced filtering capabilities
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Popular Examples (Always Visible) */}
      {!currentQuery && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Quick Start:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES_BY_CATEGORY.popular.slice(0, 4).map(example => (
              <Button
                key={example.id}
                variant="outline"
                size="sm"
                onClick={() => onApplyExample(example)}
                className="text-xs"
              >
                <example.icon className="w-3 h-3 mr-1" />
                {example.title.split(' ')[0]} {example.title.split(' ')[1]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}