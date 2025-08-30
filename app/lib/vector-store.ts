import OpenAI from 'openai';

// Enhanced data model for cached services
export interface CachedService {
  id: string;
  url: string;
  title: string;
  serviceList: string;
  description: string;
  queryEmbedding: number[];
  searchQuery: string;
  persona: string;
  category: string;
  relevanceScore: number;
  timestamp: Date;
  sourceType: 'cached' | 'web_search';
  metadata?: {
    domain?: string;
    searchTerms?: string[];
    apiSource?: 'claude' | 'serpapi' | 'fallback';
  };
}

export interface QueryRequest {
  question: string;
  persona: string;
  similarityThreshold?: number;
  maxResults?: number;
}

export interface VectorSearchResult {
  cachedServices: CachedService[];
  needsWebSearch: boolean;
  cacheHitCount: number;
  searchAnalytics: {
    queryEmbedding: number[];
    similarityScores: number[];
    searchTime: number;
  };
}

// In-memory vector store (in production, replace with persistent database)
class InMemoryVectorStore {
  private services: Map<string, CachedService> = new Map();
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  // Generate embedding for text using OpenAI
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      throw new Error('Embedding generation failed');
    }
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

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

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  // Store service with embedding
  async storeService(service: Omit<CachedService, 'id' | 'queryEmbedding' | 'timestamp'>): Promise<string> {
    const id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate embedding for the search query
    const embedding = await this.generateEmbedding(service.searchQuery);
    
    const cachedService: CachedService = {
      ...service,
      id,
      queryEmbedding: embedding,
      timestamp: new Date(),
    };

    this.services.set(id, cachedService);
    return id;
  }

  // Search for similar services
  async searchSimilar(query: QueryRequest): Promise<VectorSearchResult> {
    const startTime = Date.now();
    const {
      question,
      persona,
      similarityThreshold = 0.8,
      maxResults = 5
    } = query;

    // Generate embedding for the search query
    const queryEmbedding = await this.generateEmbedding(question);

    // Calculate similarities with all stored services
    const similarities: Array<{
      service: CachedService;
      similarity: number;
    }> = [];

    for (const service of this.services.values()) {
      // Consider persona matching for better relevance
      const personaBoost = service.persona === persona ? 0.1 : 0;
      const similarity = this.cosineSimilarity(queryEmbedding, service.queryEmbedding) + personaBoost;
      
      if (similarity >= similarityThreshold) {
        similarities.push({ service, similarity });
      }
    }

    // Sort by similarity (descending)
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Get top results
    const topResults = similarities.slice(0, maxResults);
    const cachedServices = topResults.map(result => ({
      ...result.service,
      relevanceScore: result.similarity
    }));

    const searchTime = Date.now() - startTime;
    const needsWebSearch = cachedServices.length < maxResults;

    return {
      cachedServices,
      needsWebSearch,
      cacheHitCount: cachedServices.length,
      searchAnalytics: {
        queryEmbedding,
        similarityScores: topResults.map(r => r.similarity),
        searchTime
      }
    };
  }

  // Get all stored services (for debugging/analytics)
  getAllServices(): CachedService[] {
    return Array.from(this.services.values());
  }

  // Clear cache (for maintenance)
  clearCache(): void {
    this.services.clear();
  }

  // Get cache statistics
  getCacheStats() {
    const services = Array.from(this.services.values());
    const now = new Date();
    
    return {
      totalServices: services.length,
      cacheSize: this.services.size,
      sourceBreakdown: {
        webSearch: services.filter(s => s.sourceType === 'web_search').length,
        cached: services.filter(s => s.sourceType === 'cached').length,
      },
      personaBreakdown: services.reduce((acc, service) => {
        acc[service.persona] = (acc[service.persona] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentQueries: services
        .filter(s => now.getTime() - s.timestamp.getTime() < 24 * 60 * 60 * 1000) // Last 24h
        .length
    };
  }
}

// Export singleton instance
export const vectorStore = new InMemoryVectorStore();