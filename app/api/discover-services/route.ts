import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

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
  
  return foundServices.length > 0 ? foundServices.slice(0, 4).join(', ') : 'Government services';
}

function createShortDescription(snippet: string): string {
  // Create a 10-word description from snippet
  const words = snippet.split(' ').slice(0, 10);
  let description = words.join(' ');
  
  // Ensure it ends properly
  if (description.length > 60) {
    description = description.substring(0, 57) + '...';
  }
  
  return description || 'Australian government services and support';
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
    
    // Identify service needs using LLM
    console.log('🔍 Identifying service needs with AI...');
    const serviceNeeds = await analyzeServiceNeedsWithLLM(question, persona);
    console.log('📋 Identified service needs:', serviceNeeds.map(need => need.category));
    const results: ServiceResult[] = [];
    
    // Track SerpAPI requests
    let totalSerpApiRequests = 0;
    const allSearchResults: any[] = [];
    
    // Search for each service need
    console.log('🌐 Starting web searches...');
    console.log(`📡 Planning ${serviceNeeds.slice(0, 3).length} SerpAPI requests (1 per service category)...`);
    
    for (const need of serviceNeeds.slice(0, 3)) { // Limit to top 3 needs
      console.log(`🔎 Searching for: ${need.category}`);
      for (const searchTerm of need.searchTerms.slice(0, 1)) { // One search per need
        try {
          totalSerpApiRequests++;
          console.log(`   📡 SerpAPI Request #${totalSerpApiRequests}: "${searchTerm}"`);
          
          const searchData = await searchWithSerpAPI(searchTerm);
          allSearchResults.push({
            query: searchTerm,
            category: need.category,
            totalResults: searchData.organic_results?.length || 0,
            searchData: searchData
          });
          
          console.log(`   📊 SerpAPI Response: ${searchData.organic_results?.length || 0} organic results`);
          
          if (searchData.organic_results) {
            let relevantServicesFound = 0;
            console.log(`   🔍 Checking top ${Math.min(searchData.organic_results.length, 3)} results for relevant services:`);
            
            for (const result of searchData.organic_results.slice(0, 3)) {
              console.log(`   ${relevantServicesFound + 1}. "${result.title}"`);
              console.log(`      URL: ${result.link}`);
              console.log(`      Snippet: "${result.snippet?.substring(0, 100)}..."`);
              
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
                if (!results.some(r => r.url === serviceResult.url)) {
                  console.log(`      ✅ RELEVANT SERVICE DETECTED - Adding to results`);
                  results.push(serviceResult);
                } else {
                  console.log(`      🔁 DUPLICATE - Already in results list`);
                }
              } else {
                console.log(`      ❌ NOT RELEVANT - Skipped (filtered out as non-service or irrelevant)`);
              }
            }
            
            console.log(`   📋 Summary for "${need.category}": ${relevantServicesFound}/${Math.min(searchData.organic_results.length, 3)} results were relevant services`);
          }
        } catch (searchError) {
          console.error(`❌ SerpAPI Request #${totalSerpApiRequests} failed for "${searchTerm}":`, searchError);
          // Continue with other searches
        }
      }
    }
    
    console.log(`📊 SEARCH COMPLETED - Found ${results.length} unique relevant services`);
    
    // If no results found, return fallback services
    if (results.length === 0) {
      console.log('⚠️ No services found, returning fallback services');
      const fallbackServices = [
        {
          url: 'https://example.com/career-counseling',
          title: 'Career Counseling Services',
          serviceList: 'career guidance, resume help, interview prep',
          description: 'Professional career development and job search support'
        },
        {
          url: 'https://example.com/financial-planning',
          title: 'Financial Planning Services',
          serviceList: 'budgeting, financial advice, debt management',
          description: 'Expert financial guidance and planning assistance'
        },
        {
          url: 'https://example.com/counseling',
          title: 'Counseling and Therapy',
          serviceList: 'therapy, counseling, mental health support',
          description: 'Professional mental health and emotional support services'
        }
      ];
      
      console.log('🎁 Fallback services:', fallbackServices.map(s => s.title));
      return NextResponse.json({ services: fallbackServices });
    }
    
    const finalResults = results.slice(0, 6);
    console.log('✅ FINAL RESULTS:');
    finalResults.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title}`);
      console.log(`   URL: ${service.url}`);
      console.log(`   Services: ${service.serviceList}`);
      console.log(`   Description: ${service.description}`);
    });
    
    return NextResponse.json({ services: finalResults });
    
  } catch (error) {
    console.error('Service discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover services' },
      { status: 500 }
    );
  }
}