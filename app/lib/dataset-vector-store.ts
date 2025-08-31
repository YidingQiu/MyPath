import OpenAI from 'openai';
import { Dataset, SERVICE_DOMAINS } from './dataset-fetcher';

export interface CachedDataset {
  id: string;
  dataset: Dataset;
  queryEmbedding: number[];
  serviceDomains: string[];
  searchableContent: string;
  relevanceScore: number;
  timestamp: Date;
  metadata: {
    organization: string;
    spatialCoverage?: string;
    temporalRange?: {
      from?: string;
      to?: string;
    };
    tags: string[];
    formats: string[];
    license: string;
    resourceCount: number;
  };
}

export interface DatasetSearchQuery {
  query: string;
  serviceDomains?: string[];
  spatialFilter?: string;
  organizationFilter?: string;
  tagsFilter?: string[];
  dateFrom?: string;
  dateTo?: string;
  similarityThreshold?: number;
  maxResults?: number;
}

export interface DatasetSearchResult {
  datasets: CachedDataset[];
  searchAnalytics: {
    queryEmbedding: number[];
    totalCached: number;
    filteredCount: number;
    similarityScores: number[];
    searchTime: number;
    filterBreakdown: {
      domainMatches: number;
      spatialMatches: number;
      organizationMatches: number;
      tagMatches: number;
    };
  };
}

class DatasetVectorStore {
  private datasets: Map<string, CachedDataset> = new Map();
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  // Generate embedding for dataset content
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.substring(0, 8192), // Limit to model's max input length
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate dataset embedding:', error);
      throw new Error('Dataset embedding generation failed');
    }
  }

  // Calculate cosine similarity between vectors
  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    return (normA === 0 || normB === 0) ? 0 : dotProduct / (normA * normB);
  }

  // Map dataset to service domains using AI and keyword matching
  private mapToServiceDomains(dataset: Dataset): string[] {
    const content = `${dataset.title} ${dataset.notes} ${dataset.tags.map(t => t.name).join(' ')}`.toLowerCase();
    const matchedDomains: string[] = [];

    for (const [domain, keywords] of Object.entries(SERVICE_DOMAINS)) {
      const matchCount = keywords.filter(keyword => content.includes(keyword.toLowerCase())).length;
      
      // Include domain if it has multiple keyword matches or strong single match
      if (matchCount >= 2 || (matchCount === 1 && keywords.some(k => content.includes(k) && k.length > 5))) {
        matchedDomains.push(domain);
      }
    }

    return matchedDomains.length > 0 ? matchedDomains : ['Research & Data Access'];
  }

  // Create searchable content from dataset with enhanced preprocessing
  private createSearchableContent(dataset: Dataset): string {
    const tagNames = dataset.tags.map(t => t.display_name || t.name).join(', ');
    const orgName = dataset.organization.title || dataset.organization.name;
    const location = dataset.spatial_coverage || 'Australia';
    
    // Extract key terms and make them more searchable
    const enhancedTitle = dataset.title
      .replace(/\b(data|dataset|information|statistics|register)\b/gi, '') // Remove common noise words
      .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Simplify and extract key concepts from description
    const enhancedNotes = dataset.notes
      .replace(/\b(pursuant to|in accordance with|under the|as prescribed|set out in)\b/gi, '') // Remove legal jargon
      .replace(/\b(ss\s*\d+[A-Z]*|\d+[A-Z]*\s*of\s*the\s*[A-Z]+)/gi, '') // Remove section references
      .replace(/[^\w\s.,!?]/g, ' ') // Clean special characters
      .replace(/\s+/g, ' ')
      .substring(0, 500) // Limit length for better embedding focus
      .trim();

    // Add domain keywords for better matching
    const domainKeywords = this.mapToServiceDomains(dataset).join(', ');
    
    // Create resource type summary
    const resourceTypes = dataset.resources.map(r => r.format).filter(Boolean).join(', ');
    
    return `${enhancedTitle}. ${enhancedNotes}. Agency: ${orgName}. Categories: ${domainKeywords}. Topics: ${tagNames}. Coverage: ${location}. Data formats: ${resourceTypes}.`;
  }

  // Store dataset with embedding and metadata
  async storeDataset(dataset: Dataset): Promise<string> {
    const searchableContent = this.createSearchableContent(dataset);
    const serviceDomains = this.mapToServiceDomains(dataset);
    
    // Generate embedding
    const embedding = await this.generateEmbedding(searchableContent);
    
    const cachedDataset: CachedDataset = {
      id: dataset.id,
      dataset,
      queryEmbedding: embedding,
      serviceDomains,
      searchableContent,
      relevanceScore: 1.0,
      timestamp: new Date(),
      metadata: {
        organization: dataset.organization.title || dataset.organization.name,
        spatialCoverage: dataset.spatial_coverage,
        temporalRange: {
          from: dataset.temporal_coverage_from,
          to: dataset.temporal_coverage_to,
        },
        tags: dataset.tags.map(t => t.name),
        formats: [...new Set(dataset.resources.map(r => r.format))],
        license: dataset.license_title || 'Unknown',
        resourceCount: dataset.num_resources
      }
    };

    this.datasets.set(dataset.id, cachedDataset);
    return dataset.id;
  }

  // Search datasets with vector similarity and metadata filtering
  async searchDatasets(query: DatasetSearchQuery): Promise<DatasetSearchResult> {
    const startTime = Date.now();
    const {
      query: searchQuery,
      serviceDomains = [],
      spatialFilter,
      organizationFilter,
      tagsFilter = [],
      dateFrom,
      dateTo,
      similarityThreshold = 0.3, // Lower threshold for datasets (more permissive)
      maxResults = 5
    } = query;

    console.log(`🔍 Dataset search: "${searchQuery}"`);
    console.log(`🎯 Filters: domains=${serviceDomains.join(',')}, spatial=${spatialFilter}, org=${organizationFilter}`);

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(searchQuery);

    // Filter datasets by metadata first (more efficient)
    let candidateDatasets = Array.from(this.datasets.values());
    const filterBreakdown = {
      domainMatches: 0,
      spatialMatches: 0,
      organizationMatches: 0,
      tagMatches: 0
    };

    // Apply service domain filter
    if (serviceDomains.length > 0) {
      candidateDatasets = candidateDatasets.filter(cached => 
        cached.serviceDomains.some(domain => serviceDomains.includes(domain))
      );
      filterBreakdown.domainMatches = candidateDatasets.length;
    }

    // Apply spatial filter
    if (spatialFilter) {
      candidateDatasets = candidateDatasets.filter(cached => {
        const spatial = cached.metadata.spatialCoverage?.toLowerCase() || '';
        return spatial.includes(spatialFilter.toLowerCase()) || 
               spatial.includes('australia') || // Include national datasets
               spatial === '';
      });
      filterBreakdown.spatialMatches = candidateDatasets.length;
    }

    // Apply organization filter
    if (organizationFilter) {
      candidateDatasets = candidateDatasets.filter(cached => 
        cached.metadata.organization.toLowerCase().includes(organizationFilter.toLowerCase())
      );
      filterBreakdown.organizationMatches = candidateDatasets.length;
    }

    // Apply tags filter
    if (tagsFilter.length > 0) {
      candidateDatasets = candidateDatasets.filter(cached => 
        cached.metadata.tags.some(tag => 
          tagsFilter.some(filterTag => 
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
      filterBreakdown.tagMatches = candidateDatasets.length;
    }

    // Apply temporal filter
    if (dateFrom || dateTo) {
      candidateDatasets = candidateDatasets.filter(cached => {
        const from = cached.metadata.temporalRange?.from;
        if (!from) return true;
        
        const datasetDate = new Date(from);
        if (dateFrom && datasetDate < new Date(dateFrom)) return false;
        if (dateTo && datasetDate > new Date(dateTo)) return false;
        
        return true;
      });
    }

    console.log(`📊 After metadata filtering: ${candidateDatasets.length} candidates`);

    // Calculate similarities for filtered candidates
    const similarities: Array<{
      dataset: CachedDataset;
      similarity: number;
    }> = [];

    console.log(`🔍 Calculating similarities for ${candidateDatasets.length} candidates...`);
    
    let maxSimilarity = 0;
    let minSimilarity = 1;
    const allSimilarities: number[] = [];

    for (const cached of candidateDatasets) {
      const similarity = this.cosineSimilarity(queryEmbedding, cached.queryEmbedding);
      allSimilarities.push(similarity);
      
      maxSimilarity = Math.max(maxSimilarity, similarity);
      minSimilarity = Math.min(minSimilarity, similarity);
      
      // Boost score for domain matches
      let boostedSimilarity = similarity;
      if (serviceDomains.length > 0) {
        const domainMatches = cached.serviceDomains.filter(d => serviceDomains.includes(d)).length;
        boostedSimilarity += (domainMatches * 0.1); // +0.1 per domain match
      }
      
      // Debug: Log first few similarities
      if (similarities.length < 5) {
        console.log(`   Dataset "${cached.dataset.title.substring(0, 50)}...": similarity=${similarity.toFixed(3)}, boosted=${boostedSimilarity.toFixed(3)}, threshold=${similarityThreshold}`);
      }
      
      if (boostedSimilarity >= similarityThreshold) {
        similarities.push({ 
          dataset: { ...cached, relevanceScore: boostedSimilarity }, 
          similarity: boostedSimilarity 
        });
      }
    }

    console.log(`📊 Similarity Analysis:`);
    console.log(`   Max similarity: ${maxSimilarity.toFixed(3)}`);
    console.log(`   Min similarity: ${minSimilarity.toFixed(3)}`);
    console.log(`   Average similarity: ${(allSimilarities.reduce((a, b) => a + b, 0) / allSimilarities.length).toFixed(3)}`);
    console.log(`   Threshold: ${similarityThreshold}`);
    console.log(`   Results above threshold: ${similarities.length}`);

    // If no results found, try with lower threshold
    if (similarities.length === 0 && allSimilarities.length > 0) {
      console.log(`⚠️ No results with threshold ${similarityThreshold}, trying lower threshold...`);
      const lowerThreshold = Math.max(0.1, maxSimilarity * 0.5); // Use 50% of max similarity, minimum 0.1
      console.log(`🔄 Retrying with threshold: ${lowerThreshold.toFixed(3)}`);
      
      for (const cached of candidateDatasets) {
        const similarity = this.cosineSimilarity(queryEmbedding, cached.queryEmbedding);
        
        let boostedSimilarity = similarity;
        if (serviceDomains.length > 0) {
          const domainMatches = cached.serviceDomains.filter(d => serviceDomains.includes(d)).length;
          boostedSimilarity += (domainMatches * 0.1);
        }
        
        if (boostedSimilarity >= lowerThreshold) {
          similarities.push({ 
            dataset: { ...cached, relevanceScore: boostedSimilarity }, 
            similarity: boostedSimilarity 
          });
        }
      }
      
      console.log(`✅ Lower threshold results: ${similarities.length} datasets found`);
    }

    // Sort by similarity score (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Get top results
    const topResults = similarities.slice(0, maxResults);
    const resultDatasets = topResults.map(r => r.dataset);

    const searchTime = Date.now() - startTime;
    
    console.log(`✅ Dataset search complete: ${resultDatasets.length} results in ${searchTime}ms`);

    return {
      datasets: resultDatasets,
      searchAnalytics: {
        queryEmbedding,
        totalCached: this.datasets.size,
        filteredCount: candidateDatasets.length,
        similarityScores: topResults.map(r => r.similarity),
        searchTime,
        filterBreakdown
      }
    };
  }

  // Get all cached datasets
  getAllDatasets(): CachedDataset[] {
    return Array.from(this.datasets.values());
  }

  // Get cache statistics
  getCacheStats() {
    const datasets = Array.from(this.datasets.values());
    const now = new Date();
    
    return {
      totalDatasets: datasets.length,
      serviceDomainBreakdown: Object.fromEntries(
        Object.keys(SERVICE_DOMAINS).map(domain => [
          domain, 
          datasets.filter(d => d.serviceDomains.includes(domain)).length
        ])
      ),
      organizationBreakdown: datasets.reduce((acc, dataset) => {
        const org = dataset.metadata.organization;
        acc[org] = (acc[org] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      spatialBreakdown: datasets.reduce((acc, dataset) => {
        const spatial = dataset.metadata.spatialCoverage || 'Unknown';
        acc[spatial] = (acc[spatial] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      formatBreakdown: datasets.reduce((acc, dataset) => {
        dataset.metadata.formats.forEach(format => {
          acc[format] = (acc[format] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
      recentlyAdded: datasets.filter(d => 
        now.getTime() - d.timestamp.getTime() < 24 * 60 * 60 * 1000
      ).length
    };
  }

  // Clear cache
  clearCache(): void {
    this.datasets.clear();
  }

  // Get cache size
  size(): number {
    return this.datasets.size;
  }
}

// Export singleton instance
export const datasetVectorStore = new DatasetVectorStore();