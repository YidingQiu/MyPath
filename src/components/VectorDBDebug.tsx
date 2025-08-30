'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Database, TrendingUp, Clock, Search } from 'lucide-react';

interface CacheStats {
  totalServices: number;
  cacheSize: number;
  sourceBreakdown: {
    webSearch: number;
    cached: number;
  };
  personaBreakdown: Record<string, number>;
  recentQueries: number;
}

interface PerformanceData {
  totalQueries: number;
  queriesLast24h: number;
  queriesLastWeek: number;
  averageRelevanceScore: number;
  cacheHitRate: {
    cached: number;
    webSearch: number;
  };
  popularPersonas: [string, number][];
  popularCategories: [string, number][];
}

export function VectorDBDebug() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, perfRes] = await Promise.all([
        fetch('/api/analytics?action=stats'),
        fetch('/api/analytics?action=performance')
      ]);
      
      if (statsRes.ok && perfRes.ok) {
        const statsData = await statsRes.json();
        const perfData = await perfRes.json();
        setStats(statsData.data);
        setPerformance(perfData.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      const response = await fetch('/api/analytics?action=clear-cache', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchStats(); // Refresh stats
        alert('Cache cleared successfully!');
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6" />
          Vector Database Analytics
        </h2>
        <div className="space-x-2">
          <Button onClick={fetchStats} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={clearCache} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Cache Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="w-4 h-4" />
                Total Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">Stored in vector DB</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Web Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sourceBreakdown.webSearch}</div>
              <p className="text-xs text-muted-foreground">New discoveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentQueries}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Cache Hit Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalServices > 0 
                  ? Math.round((stats.sourceBreakdown.cached / stats.totalServices) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Cache efficiency</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {performance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Query Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Queries</span>
                  <Badge variant="secondary">{performance.totalQueries}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last 24h</span>
                  <Badge variant="outline">{performance.queriesLast24h}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Week</span>
                  <Badge variant="outline">{performance.queriesLastWeek}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Relevance Score</span>
                  <Badge variant="default">
                    {performance.averageRelevanceScore.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performance.popularPersonas.slice(0, 5).map(([persona, count]) => (
                  <div key={persona} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{persona.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Popular Service Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {performance.popularCategories.map(([category, count]) => (
                  <div key={category} className="text-center p-2 bg-muted rounded-lg">
                    <div className="font-medium text-sm">{category}</div>
                    <Badge variant="outline" className="mt-1">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}