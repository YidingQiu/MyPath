import { NextRequest, NextResponse } from 'next/server';
import { vectorStore } from '../../lib/vector-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    switch (action) {
      case 'stats':
        // Get cache statistics
        const stats = vectorStore.getCacheStats();
        return NextResponse.json({
          success: true,
          data: {
            ...stats,
            timestamp: new Date().toISOString(),
          }
        });
      
      case 'services':
        // Get all stored services (for debugging)
        const services = vectorStore.getAllServices();
        return NextResponse.json({
          success: true,
          data: {
            services: services.map(service => ({
              id: service.id,
              title: service.title,
              url: service.url,
              searchQuery: service.searchQuery,
              persona: service.persona,
              category: service.category,
              relevanceScore: service.relevanceScore,
              timestamp: service.timestamp,
              sourceType: service.sourceType
            })),
            count: services.length
          }
        });
      
      case 'performance':
        // Get performance metrics
        const allServices = vectorStore.getAllServices();
        const now = new Date();
        const last24h = allServices.filter(s => 
          now.getTime() - s.timestamp.getTime() < 24 * 60 * 60 * 1000
        );
        const lastWeek = allServices.filter(s => 
          now.getTime() - s.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
        );
        
        return NextResponse.json({
          success: true,
          data: {
            totalQueries: allServices.length,
            queriesLast24h: last24h.length,
            queriesLastWeek: lastWeek.length,
            averageRelevanceScore: allServices.reduce((sum, s) => sum + s.relevanceScore, 0) / allServices.length || 0,
            cacheHitRate: {
              // Estimate cache hit rate based on source types
              cached: allServices.filter(s => s.sourceType === 'cached').length,
              webSearch: allServices.filter(s => s.sourceType === 'web_search').length,
            },
            popularPersonas: Object.entries(
              allServices.reduce((acc, service) => {
                acc[service.persona] = (acc[service.persona] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort(([,a], [,b]) => b - a).slice(0, 5),
            popularCategories: Object.entries(
              allServices.reduce((acc, service) => {
                acc[service.category] = (acc[service.category] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort(([,a], [,b]) => b - a).slice(0, 5)
          }
        });
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: stats, services, or performance'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve analytics data'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'clear-cache') {
      vectorStore.clearCache();
      return NextResponse.json({
        success: true,
        message: 'Vector database cache cleared successfully'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: clear-cache'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform cache operation'
    }, { status: 500 });
  }
}