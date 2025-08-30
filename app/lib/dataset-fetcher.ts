// Dataset interfaces based on data.gov.au API structure
export interface Dataset {
  id: string;
  title: string;
  notes: string; // description
  organization: {
    id: string;
    name: string;
    title: string;
    description: string;
  };
  tags: Array<{
    name: string;
    display_name: string;
  }>;
  spatial_coverage?: string;
  temporal_coverage_from?: string;
  temporal_coverage_to?: string;
  license_title?: string;
  license_url?: string;
  metadata_created: string;
  metadata_modified: string;
  num_resources: number;
  resources: Array<{
    id: string;
    name: string;
    description?: string;
    format: string;
    url: string;
    size?: number;
  }>;
  geospatial_topic?: string[];
  language?: string;
  state: 'active' | 'archived';
}

export interface DatasetSearchOptions {
  query?: string;
  rows?: number;
  start?: number;
  spatialFilter?: string; // e.g., "ACT", "NSW"
  organizationFilter?: string;
  tagsFilter?: string[];
  dateFrom?: string;
  dateTo?: string;
  onlyActive?: boolean;
}

export interface DatasetFetchResult {
  datasets: Dataset[];
  totalCount: number;
  hasMore: boolean;
  nextStart?: number;
}

// Service domain mappings for classification
export const SERVICE_DOMAINS = {
  'Identity & Status': ['identity', 'visa', 'citizenship', 'passport', 'migration', 'enrolment', 'birth', 'death', 'marriage'],
  'Income, Work & Enterprise': ['employment', 'job', 'payroll', 'business', 'grant', 'procurement', 'tender', 'economic', 'industry', 'workforce'],
  'Education & Skills': ['education', 'school', 'university', 'training', 'skills', 'qualification', 'vet', 'higher education', 'learning'],
  'Health & Wellbeing': ['health', 'medicare', 'mental health', 'disability', 'medical', 'hospital', 'wellness', 'aged care', 'ndis'],
  'Family & Care': ['family', 'child', 'parent', 'carer', 'childcare', 'family payment', 'parenting', 'children'],
  'Housing & Utilities': ['housing', 'rent', 'utilities', 'energy', 'electricity', 'gas', 'water', 'accommodation', 'property'],
  'Mobility & Transport': ['transport', 'license', 'permit', 'vehicle', 'driver', 'road', 'traffic', 'mobility', 'accessibility'],
  'Civic & Community': ['voting', 'election', 'volunteer', 'community', 'civic', 'local government', 'participation', 'democracy'],
  'Safety, Justice & Consumer': ['police', 'justice', 'legal', 'court', 'crime', 'safety', 'consumer', 'scam', 'fraud', 'tenancy'],
  'Environment, Hazards & Recovery': ['environment', 'disaster', 'emergency', 'bushfire', 'flood', 'climate', 'weather', 'recovery', 'hazard'],
  'Taxes & Money': ['tax', 'ato', 'financial', 'money', 'debt', 'concession', 'rebate', 'superannuation', 'pension'],
  'Licensing & Compliance': ['license', 'compliance', 'regulation', 'permit', 'professional', 'certification', 'standards'],
  'Digital Life & Security': ['digital', 'cybersecurity', 'technology', 'online', 'mygov', 'digital identity', 'privacy', 'data protection'],
  'Research & Data Access': ['research', 'data', 'statistics', 'science', 'innovation', 'analytics', 'information', 'knowledge'],
  'Aging, Retirement & Legacy': ['aged', 'senior', 'retirement', 'superannuation', 'pension', 'elderly', 'will', 'estate', 'legacy']
} as const;

// Australian states and territories for spatial filtering
export const AUSTRALIAN_LOCATIONS = [
  'ACT', 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'NT', 'TAS',
  'Australia', 'National', 'Australian Capital Territory',
  'New South Wales', 'Victoria', 'Queensland', 'South Australia',
  'Western Australia', 'Northern Territory', 'Tasmania'
] as const;

export class DatasetFetcher {
  private baseUrl = 'https://data.gov.au/data/api/3/action/package_search';
  private cache: Map<string, DatasetFetchResult> = new Map();

  // Fetch datasets from data.gov.au API
  async fetchDatasets(options: DatasetSearchOptions = {}): Promise<DatasetFetchResult> {
    const {
      query = '*',
      rows = 50,
      start = 0,
      spatialFilter,
      organizationFilter,
      tagsFilter,
      dateFrom,
      dateTo,
      onlyActive = true
    } = options;

    // Create cache key
    const cacheKey = JSON.stringify(options);
    if (this.cache.has(cacheKey)) {
      console.log('📚 Returning cached dataset results');
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log(`📡 Fetching datasets: query="${query}", rows=${rows}, start=${start}`);
      
      // Build query parameters
      const params = new URLSearchParams({
        q: query,
        rows: rows.toString(),
        start: start.toString()
      });

      // Add filters
      if (spatialFilter) {
        params.append('fq', `spatial_coverage:*${spatialFilter}*`);
      }
      if (organizationFilter) {
        params.append('fq', `organization.name:*${organizationFilter}*`);
      }
      if (onlyActive) {
        params.append('fq', 'state:active');
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Dataset API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Dataset API returned error response');
      }

      // Process and normalize datasets
      const datasets: Dataset[] = data.result.results.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled Dataset',
        notes: item.notes || '',
        organization: {
          id: item.organization?.id || '',
          name: item.organization?.name || '',
          title: item.organization?.title || '',
          description: item.organization?.description || ''
        },
        tags: item.tags || [],
        spatial_coverage: item.spatial_coverage,
        temporal_coverage_from: item.temporal_coverage_from,
        temporal_coverage_to: item.temporal_coverage_to,
        license_title: item.license_title,
        license_url: item.license_url,
        metadata_created: item.metadata_created,
        metadata_modified: item.metadata_modified,
        num_resources: item.num_resources || 0,
        resources: item.resources || [],
        geospatial_topic: item.geospatial_topic || [],
        language: item.language,
        state: item.state
      }));

      // Apply additional filtering
      let filteredDatasets = datasets;
      
      if (tagsFilter && tagsFilter.length > 0) {
        filteredDatasets = datasets.filter(dataset => 
          dataset.tags.some(tag => 
            tagsFilter.some(filterTag => 
              tag.name.toLowerCase().includes(filterTag.toLowerCase())
            )
          )
        );
      }

      if (dateFrom || dateTo) {
        filteredDatasets = filteredDatasets.filter(dataset => {
          if (!dataset.temporal_coverage_from) return true;
          
          const datasetDate = new Date(dataset.temporal_coverage_from);
          if (dateFrom && datasetDate < new Date(dateFrom)) return false;
          if (dateTo && datasetDate > new Date(dateTo)) return false;
          
          return true;
        });
      }

      const result: DatasetFetchResult = {
        datasets: filteredDatasets,
        totalCount: data.result.count,
        hasMore: start + rows < data.result.count,
        nextStart: start + rows
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log(`✅ Fetched ${filteredDatasets.length} datasets (${data.result.count} total available)`);
      return result;

    } catch (error) {
      console.error('❌ Dataset fetch failed:', error);
      throw error;
    }
  }

  // Fetch all datasets in batches (for initial vector database population)
  async fetchAllDatasets(onProgress?: (progress: { current: number; total: number; datasets: Dataset[] }) => void): Promise<Dataset[]> {
    console.log('📦 Starting bulk dataset fetch...');
    
    const allDatasets: Dataset[] = [];
    const batchSize = 100;
    let start = 0;
    let totalCount = 0;

    try {
      // Get first batch to determine total count
      const firstBatch = await this.fetchDatasets({ rows: batchSize, start: 0 });
      totalCount = firstBatch.totalCount;
      allDatasets.push(...firstBatch.datasets);
      
      console.log(`📊 Total datasets to fetch: ${totalCount}`);
      onProgress?.({ current: allDatasets.length, total: totalCount, datasets: [...allDatasets] });

      // Fetch remaining batches
      start = batchSize;
      while (start < totalCount) {
        console.log(`📡 Fetching batch ${Math.floor(start / batchSize) + 1}/${Math.ceil(totalCount / batchSize)}...`);
        
        const batch = await this.fetchDatasets({ rows: batchSize, start });
        allDatasets.push(...batch.datasets);
        
        onProgress?.({ current: allDatasets.length, total: totalCount, datasets: [...allDatasets] });
        
        start += batchSize;
        
        // Add small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Bulk fetch complete: ${allDatasets.length} datasets`);
      return allDatasets;

    } catch (error) {
      console.error('❌ Bulk dataset fetch failed:', error);
      throw error;
    }
  }

  // Map dataset to service domains using keyword matching
  mapToServiceDomains(dataset: Dataset): string[] {
    const content = `${dataset.title} ${dataset.notes} ${dataset.tags.map(t => t.name).join(' ')}`.toLowerCase();
    const matchedDomains: string[] = [];

    for (const [domain, keywords] of Object.entries(SERVICE_DOMAINS)) {
      const matches = keywords.filter(keyword => content.includes(keyword.toLowerCase()));
      if (matches.length > 0) {
        matchedDomains.push(domain);
      }
    }

    return matchedDomains.length > 0 ? matchedDomains : ['Research & Data Access']; // Default domain
  }

  // Extract searchable content for embedding generation
  getSearchableContent(dataset: Dataset): string {
    const tagNames = dataset.tags.map(t => t.display_name || t.name).join(', ');
    const orgName = dataset.organization.title || dataset.organization.name;
    
    return `${dataset.title}. ${dataset.notes}. Organization: ${orgName}. Tags: ${tagNames}. Location: ${dataset.spatial_coverage || 'Australia'}.`;
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const datasetFetcher = new DatasetFetcher();