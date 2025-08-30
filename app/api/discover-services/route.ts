import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { vectorStore, type CachedService, type VectorSearchResult } from '../../lib/vector-store';

interface ServiceResult {
  url: string;
  title: string;
  serviceList: string;
  description: string;
}

interface ServiceNeed {
  category: string;
  searchTerms: string[];
  priority: number;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Fallback service scenarios for when LLM is unavailable
const FALLBACK_SERVICE_SCENARIOS: Record<string, ServiceNeed[]> = {
  'lose job': [
    { category: 'Job Search Services', searchTerms: ['job search assistance', 'employment agencies', 'career counseling services'], priority: 1 },
    { category: 'Financial Planning', searchTerms: ['financial planning unemployment', 'budgeting assistance', 'financial counseling'], priority: 1 },
  ],
  'healthcare': [
    { category: 'Medical Services', searchTerms: ['medical clinics near me', 'healthcare providers', 'medical specialists'], priority: 1 },
    { category: 'Mental Health', searchTerms: ['mental health services', 'counseling therapy', 'psychological support'], priority: 1 },
  ]
};

async function analyzeServiceNeedsWithLLM(question: string, persona: string): Promise<ServiceNeed[]> {
  try {
    console.log('🤖 Calling Claude to analyze service needs...');
    
    const prompt = `You are an expert service advisor. A person with the persona "${persona}" has this problem: "${question}"

Based on their situation, what types of services or solutions might help them address their problem? Think of professional services, businesses, organizations, or resources that could provide assistance.

Please respond with a JSON array of 3-4 service categories. Each should have:
- category: A descriptive name for the service/solution area
- searchTerms: An array of 2-3 specific search terms for finding relevant services to help with this problem
- priority: 1 (high) or 2 (medium)

Focus on practical services that could realistically help solve or address their problem.

Example format:
[
  {
    "category": "Career Counseling Services",
    "searchTerms": ["career counseling near me", "professional career advice", "job transition coaching"],
    "priority": 1
  }
]

Respond with ONLY the JSON array, no other text.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log('🤖 Claude raw response:', response.content[0]);

    if (response.content[0].type === 'text') {
      const responseText = response.content[0].text.trim();
      
      // Extract JSON from the response (in case Claude adds extra text)
      let jsonStart = responseText.indexOf('[');
      let jsonEnd = responseText.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No JSON array found in Claude response');
      }
      
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      const serviceNeeds = JSON.parse(jsonString) as ServiceNeed[];
      
      console.log('✅ Claude identified service needs:', serviceNeeds.map(s => s.category));
      return serviceNeeds;
    }
    
    throw new Error('Unexpected response format from Claude');
    
  } catch (error) {
    console.error('❌ Claude analysis failed:', error);
    return getFallbackServiceNeeds(question, persona);
  }
}

function getFallbackServiceNeeds(question: string, persona: string): ServiceNeed[] {
  console.log('🔄 Using fallback service identification...');
  const lowerQuestion = question.toLowerCase();
  
  // Check for known scenarios in fallback
  for (const [scenario, needs] of Object.entries(FALLBACK_SERVICE_SCENARIOS)) {
    if (lowerQuestion.includes(scenario)) {
      console.log(`📋 Matched fallback scenario: ${scenario}`);
      return needs;
    }
  }
  
  // Smart keyword matching
  const fallbackNeeds: ServiceNeed[] = [];
  
  if (lowerQuestion.includes('health') || lowerQuestion.includes('medical') || lowerQuestion.includes('doctor')) {
    fallbackNeeds.push(
      { category: 'Medical Services', searchTerms: ['medical clinics near me', 'healthcare providers'], priority: 1 },
      { category: 'Mental Health Services', searchTerms: ['mental health counseling', 'therapy services near me'], priority: 1 }
    );
  }
  
  if (lowerQuestion.includes('job') || lowerQuestion.includes('work') || lowerQuestion.includes('employ') || lowerQuestion.includes('unemploy')) {
    fallbackNeeds.push({ category: 'Employment Services', searchTerms: ['job search assistance', 'employment agencies near me'], priority: 1 });
  }
  
  if (lowerQuestion.includes('money') || lowerQuestion.includes('financial') || lowerQuestion.includes('income') || lowerQuestion.includes('payment')) {
    fallbackNeeds.push({ category: 'Financial Services', searchTerms: ['financial planning services', 'financial counseling near me'], priority: 1 });
  }
  
  if (fallbackNeeds.length > 0) {
    console.log('📋 Using keyword-based fallback services:', fallbackNeeds.map(s => s.category));
    return fallbackNeeds;
  }
  
  // Final fallback
  console.log('📋 Using default fallback services');
  return FALLBACK_SERVICE_SCENARIOS['lose job'];
}

function isRelevantService(url: string, title: string, snippet: string): boolean {
  const content = `${url} ${title} ${snippet}`.toLowerCase();
  
  // Filter out job boards and job listings since we want services, not jobs
  const jobBoardIndicators = ['indeed.com', 'seek.com', 'linkedin.com/jobs', 'glassdoor.com', 'monster.com'];
  if (jobBoardIndicators.some(indicator => url.includes(indicator))) {
    return false;
  }
  
  // Look for service-related keywords
  const serviceKeywords = [
    'service', 'support', 'help', 'assistance', 'advice', 'counseling', 'therapy', 
    'consultation', 'guidance', 'clinic', 'center', 'organization', 'agency',
    'professional', 'specialist', 'expert', 'coach', 'training', 'program'
  ];
  
  const hasServiceKeywords = serviceKeywords.some(keyword => content.includes(keyword));
  
  // Avoid social media and generic content sites
  const excludePatterns = ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com', 'quora.com'];
  const isExcluded = excludePatterns.some(pattern => url.includes(pattern));
  
  return hasServiceKeywords && !isExcluded;
}

async function searchWithSerpAPI(query: string): Promise<any> {
  const apiKey = process.env.SERP_API_KEY;
  
  if (!apiKey) {
    throw new Error('SERP_API_KEY environment variable is not set');
  }
  
  const response = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=10&hl=en&gl=au`);
  
  if (!response.ok) {
    throw new Error(`SerpAPI request failed: ${response.statusText}`);
  }
  
  return response.json();
}

async function summarizeServiceWithClaude(title: string, snippet: string, url: string, category: string): Promise<{serviceList: string, description: string}> {
  try {
    const prompt = `You are summarizing a service that might help someone. Here's the information:

Title: ${title}
URL: ${url}  
Snippet: ${snippet}
Service Category: ${category}

Please provide:
1. A brief comma-separated list of 3-4 key services this provider offers (max 50 characters)
2. A concise description of how they could help (max 80 characters)

Respond with ONLY a JSON object in this format:
{
  "serviceList": "counseling, therapy, support groups, crisis help",
  "description": "Professional mental health services and emotional support"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.content[0].type === 'text') {
      const result = JSON.parse(response.content[0].text.trim());
      return {
        serviceList: result.serviceList || extractServiceList(title, snippet),
        description: result.description || createShortDescription(snippet)
      };
    }
  } catch (error) {
    console.error('Claude summarization failed:', error);
  }
  
  // Fallback to existing functions
  return {
    serviceList: extractServiceList(title, snippet),
    description: createShortDescription(snippet)
  };
}

function extractServiceList(title: string, snippet: string): string {
  // Extract key services mentioned in title or snippet
  const serviceKeywords = [
    'payment', 'benefit', 'allowance', 'support', 'assistance', 'service',
    'job', 'employment', 'career', 'training', 'education', 'health',
    'mental health', 'counseling', 'disability', 'aged care', 'childcare'
  ];
  
  const content = `${title} ${snippet}`.toLowerCase();
  const foundServices = serviceKeywords.filter(keyword => content.includes(keyword));
  
  return foundServices.length > 0 ? foundServices.slice(0, 4).join(', ') : 'Services';
}

function createShortDescription(snippet: string): string {
  // Create a 10-word description from snippet
  const words = snippet.split(' ').slice(0, 10);
  let description = words.join(' ');
  
  // Ensure it ends properly
  if (description.length > 60) {
    description = description.substring(0, 57) + '...';
  }
  
  return description || 'Professional services and support';
}

export async function POST(request: NextRequest) {
  try {
    const { question, persona } = await request.json();
    
    console.log('🎯 NEW SERVICE DISCOVERY REQUEST');
    console.log('📝 Question:', question);
    console.log('👤 Persona:', persona);
    
    if (!question || !persona) {
      console.log('❌ Missing required parameters');
      return NextResponse.json(
        { error: 'Question and persona are required' },
        { status: 400 }
      );
    }

    // STEP 1: Check Vector Database First
    console.log('📚 Checking vector database for cached results...');
    let vectorResults: VectorSearchResult;
    
    try {
      vectorResults = await vectorStore.searchSimilar({
        question,
        persona,
        similarityThreshold: 0.75, // Slightly lower threshold for better recall
        maxResults: 5
      });
      
      console.log(`📊 Vector Search Results:`);
      console.log(`   Cache hits: ${vectorResults.cacheHitCount}/5`);
      console.log(`   Needs web search: ${vectorResults.needsWebSearch}`);
      console.log(`   Search time: ${vectorResults.searchAnalytics.searchTime}ms`);
      
    } catch (vectorError) {
      console.error('❌ Vector search failed:', vectorError);
      vectorResults = {
        cachedServices: [],
        needsWebSearch: true,
        cacheHitCount: 0,
        searchAnalytics: {
          queryEmbedding: [],
          similarityScores: [],
          searchTime: 0
        }
      };
    }

    // STEP 2: Convert cached results to ServiceResult format
    const cachedResults: ServiceResult[] = vectorResults.cachedServices.map(cached => ({
      url: cached.url,
      title: cached.title,
      serviceList: cached.serviceList,
      description: cached.description
    }));

    // STEP 3: If we have enough results from cache, return them
    if (!vectorResults.needsWebSearch && cachedResults.length >= 5) {
      console.log('✅ SUFFICIENT CACHE RESULTS - Returning cached services');
      console.log('📋 Cached services:', cachedResults.map(s => s.title));
      
      return NextResponse.json({ 
        services: cachedResults,
        metadata: {
          source: 'cache',
          cacheHitCount: vectorResults.cacheHitCount,
          searchTime: vectorResults.searchAnalytics.searchTime
        }
      });
    }

    // STEP 4: Need to do web search to fill gaps
    console.log('🌐 Starting web search to fill gaps...');
    const serviceNeeds = await analyzeServiceNeedsWithLLM(question, persona);
    console.log('📋 Identified service needs:', serviceNeeds.map(need => need.category));
    
    const webSearchResults: ServiceResult[] = [];
    let totalSerpApiRequests = 0;
    
    // Search for each service need
    for (const need of serviceNeeds.slice(0, 3)) { // Limit to top 3 needs
      console.log(`🔎 Searching for: ${need.category}`);
      
      for (const searchTerm of need.searchTerms.slice(0, 1)) { // One search per need
        try {
          totalSerpApiRequests++;
          console.log(`   📡 SerpAPI Request #${totalSerpApiRequests}: "${searchTerm}"`);
          
          const searchData = await searchWithSerpAPI(searchTerm);
          console.log(`   📊 SerpAPI Response: ${searchData.organic_results?.length || 0} organic results`);
          
          if (searchData.organic_results) {
            let relevantServicesFound = 0;
            console.log(`   🔍 Checking top ${Math.min(searchData.organic_results.length, 3)} results for relevant services:`);
            
            for (const result of searchData.organic_results.slice(0, 3)) {
              if (isRelevantService(result.link, result.title, result.snippet || '')) {
                relevantServicesFound++;
                
                // Use Claude to summarize the service
                const claudeSummary = await summarizeServiceWithClaude(
                  result.title, 
                  result.snippet || '', 
                  result.link, 
                  need.category
                );
                
                const serviceResult: ServiceResult = {
                  url: result.link,
                  title: result.title,
                  serviceList: claudeSummary.serviceList,
                  description: claudeSummary.description
                };
                
                // Avoid duplicates
                if (!webSearchResults.some(r => r.url === serviceResult.url) && 
                    !cachedResults.some(r => r.url === serviceResult.url)) {
                  console.log(`      ✅ RELEVANT SERVICE DETECTED - Adding to results`);
                  webSearchResults.push(serviceResult);
                  
                  // STEP 5: Store in vector database for future use
                  try {
                    await vectorStore.storeService({
                      url: serviceResult.url,
                      title: serviceResult.title,
                      serviceList: serviceResult.serviceList,
                      description: serviceResult.description,
                      searchQuery: question,
                      persona: persona,
                      category: need.category,
                      relevanceScore: 0.9, // New web search results get high relevance
                      sourceType: 'web_search',
                      metadata: {
                        domain: new URL(serviceResult.url).hostname,
                        searchTerms: need.searchTerms,
                        apiSource: 'serpapi'
                      }
                    });
                    console.log(`      💾 Stored service in vector database`);
                  } catch (storeError) {
                    console.error('❌ Failed to store service:', storeError);
                  }
                  
                } else {
                  console.log(`      🔁 DUPLICATE - Already in results list`);
                }
              } else {
                console.log(`      ❌ NOT RELEVANT - Skipped (filtered out as non-service)`);
              }
            }
          }
        } catch (searchError) {
          console.error(`❌ SerpAPI Request #${totalSerpApiRequests} failed for "${searchTerm}":`, searchError);
        }
      }
    }

    // STEP 6: Combine cached and web search results
    const allResults = [...cachedResults, ...webSearchResults];
    console.log(`📊 SEARCH COMPLETED - Found ${allResults.length} total services (${cachedResults.length} cached + ${webSearchResults.length} web search)`);
    
    // Return results with metadata
    const finalResults = allResults.slice(0, 6); // Limit to 6 results
    console.log('✅ FINAL RESULTS:');
    finalResults.forEach((service, index) => {
      const source = cachedResults.includes(service) ? 'CACHE' : 'WEB';
      console.log(`${index + 1}. [${source}] ${service.title}`);
      console.log(`   URL: ${service.url}`);
      console.log(`   Services: ${service.serviceList}`);
      console.log(`   Description: ${service.description}`);
    });
    
    return NextResponse.json({ 
      services: finalResults,
      metadata: {
        source: 'hybrid',
        cacheHitCount: vectorResults.cacheHitCount,
        webSearchCount: webSearchResults.length,
        totalSerpApiRequests: totalSerpApiRequests,
        searchTime: vectorResults.searchAnalytics.searchTime
      }
    });
    
  } catch (error) {
    console.error('Service discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover services' },
      { status: 500 }
    );
  }
}