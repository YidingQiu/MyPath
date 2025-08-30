import { NextRequest, NextResponse } from 'next/server';
import { datasetFetcher, Dataset } from '../../lib/dataset-fetcher';
import { datasetVectorStore, DatasetSearchQuery } from '../../lib/dataset-vector-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case 'search':
        return await handleDatasetSearch(body);
      case 'populate':
        return await handleDatasetPopulation(body);
      case 'stats':
        return await handleDatasetStats();
      case 'debug':
        return await handleDebugSearch(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: search, populate, stats, or debug' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Dataset discovery API error:', error);
    return NextResponse.json(
      { error: 'Failed to process dataset request' },
      { status: 500 }
    );
  }
}

async function handleDatasetSearch(body: any) {
  const {
    query,
    serviceDomains = [],
    spatialFilter,
    organizationFilter,
    tagsFilter = [],
    dateFrom,
    dateTo,
    similarityThreshold = 0.3,
    maxResults = 5
  } = body;

  if (!query) {
    return NextResponse.json(
      { error: 'Query is required for dataset search' },
      { status: 400 }
    );
  }

  console.log('🔍 Dataset Search Request:');
  console.log(`   Query: "${query}"`);
  console.log(`   Service Domains: ${serviceDomains.join(', ')}`);
  console.log(`   Spatial Filter: ${spatialFilter || 'None'}`);
  console.log(`   Organization Filter: ${organizationFilter || 'None'}`);

  try {
    // Check if we have datasets in vector store
    const cacheSize = datasetVectorStore.size();
    console.log(`📚 Vector store contains ${cacheSize} datasets`);

    if (cacheSize === 0) {
      console.log('⚠️ Vector store is empty. Consider running populate action first.');
      
      // Try to fetch some datasets and process them quickly
      console.log('🔄 Fetching sample datasets for immediate search...');
      const sampleResult = await datasetFetcher.fetchDatasets({ 
        query: query,
        rows: 20 
      });
      
      // Store sample datasets
      console.log(`📦 Processing ${sampleResult.datasets.length} sample datasets...`);
      for (const dataset of sampleResult.datasets) {
        try {
          await datasetVectorStore.storeDataset(dataset);
        } catch (storeError) {
          console.error('Failed to store dataset:', dataset.id, storeError);
        }
      }
    }

    // Perform vector search
    const searchQuery: DatasetSearchQuery = {
      query,
      serviceDomains,
      spatialFilter,
      organizationFilter,
      tagsFilter,
      dateFrom,
      dateTo,
      similarityThreshold,
      maxResults
    };

    const searchResult = await datasetVectorStore.searchDatasets(searchQuery);
    
    // Format results for client
    const formattedResults = searchResult.datasets.map(cached => ({
      id: cached.dataset.id,
      title: cached.dataset.title,
      description: cached.dataset.notes.substring(0, 300) + (cached.dataset.notes.length > 300 ? '...' : ''),
      organization: cached.metadata.organization,
      tags: cached.dataset.tags.map(t => t.display_name || t.name),
      serviceDomains: cached.serviceDomains,
      spatialCoverage: cached.metadata.spatialCoverage,
      temporalRange: cached.metadata.temporalRange,
      resources: cached.dataset.resources.map(r => ({
        name: r.name,
        format: r.format,
        url: r.url,
        size: r.size
      })),
      license: cached.metadata.license,
      relevanceScore: cached.relevanceScore,
      datasetUrl: `https://data.gov.au/data/dataset/${cached.dataset.id}`
    }));

    console.log(`✅ Dataset search complete: ${formattedResults.length} results`);

    return NextResponse.json({
      success: true,
      results: formattedResults,
      analytics: {
        totalCached: searchResult.searchAnalytics.totalCached,
        filteredCount: searchResult.searchAnalytics.filteredCount,
        searchTime: searchResult.searchAnalytics.searchTime,
        filterBreakdown: searchResult.searchAnalytics.filterBreakdown,
        averageSimilarity: searchResult.searchAnalytics.similarityScores.length > 0 
          ? searchResult.searchAnalytics.similarityScores.reduce((a, b) => a + b, 0) / searchResult.searchAnalytics.similarityScores.length
          : 0
      }
    });

  } catch (error) {
    console.error('❌ Dataset search failed:', error);
    return NextResponse.json(
      { error: 'Dataset search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleDatasetPopulation(body: any) {
  const { batchSize = 100, maxDatasets = 1000 } = body;
  
  console.log(`📦 Starting dataset population: max ${maxDatasets} datasets in batches of ${batchSize}`);
  
  try {
    let totalProcessed = 0;
    let start = 0;
    const processingResults = {
      totalFetched: 0,
      totalStored: 0,
      errors: 0,
      startTime: Date.now()
    };

    while (totalProcessed < maxDatasets) {
      const remaining = Math.min(batchSize, maxDatasets - totalProcessed);
      
      console.log(`📡 Fetching batch: ${start} to ${start + remaining}`);
      const batchResult = await datasetFetcher.fetchDatasets({
        rows: remaining,
        start: start
      });

      processingResults.totalFetched += batchResult.datasets.length;

      // Process each dataset in the batch
      for (const dataset of batchResult.datasets) {
        try {
          await datasetVectorStore.storeDataset(dataset);
          processingResults.totalStored++;
          
          if (processingResults.totalStored % 50 === 0) {
            console.log(`📈 Progress: ${processingResults.totalStored} datasets processed`);
          }
        } catch (storeError) {
          console.error(`❌ Failed to store dataset ${dataset.id}:`, storeError);
          processingResults.errors++;
        }
      }

      totalProcessed += batchResult.datasets.length;
      start += remaining;

      if (!batchResult.hasMore) {
        console.log('📋 Reached end of available datasets');
        break;
      }

      // Small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const processingTime = Date.now() - processingResults.startTime;
    console.log(`✅ Dataset population complete:`);
    console.log(`   Fetched: ${processingResults.totalFetched}`);
    console.log(`   Stored: ${processingResults.totalStored}`);
    console.log(`   Errors: ${processingResults.errors}`);
    console.log(`   Time: ${processingTime}ms`);

    return NextResponse.json({
      success: true,
      message: 'Dataset population completed',
      stats: {
        ...processingResults,
        processingTime,
        cacheSize: datasetVectorStore.size()
      }
    });

  } catch (error) {
    console.error('❌ Dataset population failed:', error);
    return NextResponse.json(
      { error: 'Dataset population failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleDatasetStats() {
  try {
    const stats = datasetVectorStore.getCacheStats();
    
    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage()
      }
    });
  } catch (error) {
    console.error('❌ Dataset stats failed:', error);
    return NextResponse.json(
      { error: 'Failed to get dataset statistics' },
      { status: 500 }
    );
  }
}

async function handleDebugSearch(body: any) {
  const { query, sampleSize = 5 } = body;
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query is required for debug search' },
      { status: 400 }
    );
  }

  try {
    console.log(`🔧 DEBUG: Analyzing query "${query}" against ${sampleSize} sample datasets`);
    
    // Get sample datasets
    const allDatasets = datasetVectorStore.getAllDatasets();
    const sampleDatasets = allDatasets.slice(0, sampleSize);
    
    // Generate query embedding
    const queryEmbedding = await datasetVectorStore.generateEmbedding(query);
    
    // Calculate similarities and gather debug info
    const debugResults = [];
    for (const cached of sampleDatasets) {
      const similarity = datasetVectorStore.cosineSimilarity(queryEmbedding, cached.queryEmbedding);
      
      debugResults.push({
        id: cached.dataset.id,
        title: cached.dataset.title,
        searchableContent: cached.searchableContent.substring(0, 200) + '...',
        serviceDomains: cached.serviceDomains,
        similarity: similarity,
        embeddingLength: cached.queryEmbedding.length,
        tags: cached.dataset.tags.map(t => t.name)
      });
    }
    
    // Sort by similarity
    debugResults.sort((a, b) => b.similarity - a.similarity);
    
    return NextResponse.json({
      success: true,
      debug: {
        query,
        queryEmbedding: queryEmbedding.slice(0, 10), // First 10 dimensions for debugging
        queryEmbeddingLength: queryEmbedding.length,
        totalDatasets: allDatasets.length,
        sampleSize: debugResults.length,
        results: debugResults,
        similarities: {
          max: Math.max(...debugResults.map(r => r.similarity)),
          min: Math.min(...debugResults.map(r => r.similarity)),
          average: debugResults.reduce((sum, r) => sum + r.similarity, 0) / debugResults.length
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Debug search failed:', error);
    return NextResponse.json(
      { error: 'Debug search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for simple health check
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Dataset Discovery API is running',
    cacheSize: datasetVectorStore.size(),
    availableActions: ['search', 'populate', 'stats']
  });
}