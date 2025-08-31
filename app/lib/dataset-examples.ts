import { MapPin, Building, Tag, TrendingUp, Globe, Users, Briefcase, GraduationCap, Heart, Home } from 'lucide-react';

export interface DatasetExample {
  id: string;
  title: string;
  description: string;
  query: string;
  serviceDomains: string[];
  location?: string;
  organization?: string;
  tags?: string[];
  expectedResults: string;
  icon: any;
  category: 'popular' | 'domain' | 'location' | 'advanced';
}

export const PRESET_EXAMPLES: DatasetExample[] = [
  // POPULAR SEARCHES (Most common use cases)
  {
    id: 'health-services',
    title: 'Health Services Data',
    description: 'Find healthcare facility locations, services, and statistics',
    query: 'health services hospitals clinics medical facilities',
    serviceDomains: ['Health & Wellbeing'],
    location: 'Australia',
    organization: 'Health',
    expectedResults: 'Hospital locations, medical service statistics, health facility data',
    icon: Heart,
    category: 'popular'
  },
  {
    id: 'employment-stats',
    title: 'Employment Statistics',
    description: 'Labor market data, unemployment rates, job vacancy information',
    query: 'employment unemployment jobs labor market statistics',
    serviceDomains: ['Income, Work & Enterprise'],
    location: 'Australia',
    organization: 'Treasury',
    expectedResults: 'Labor force statistics, unemployment data, job market trends',
    icon: Briefcase,
    category: 'popular'
  },
  {
    id: 'housing-affordability',
    title: 'Housing & Property Data',
    description: 'Property prices, rental markets, housing assistance programs',
    query: 'housing property rental affordability real estate',
    serviceDomains: ['Housing & Utilities'],
    location: 'ACT',
    organization: 'Treasury',
    expectedResults: 'Property value data, rental statistics, housing market analysis',
    icon: Home,
    category: 'popular'
  },
  {
    id: 'education-funding',
    title: 'Education Funding Data',
    description: 'School funding, university statistics, education outcomes',
    query: 'education funding schools universities student data',
    serviceDomains: ['Education & Skills'],
    location: 'VIC',
    organization: 'Education',
    expectedResults: 'School funding data, education statistics, student performance',
    icon: GraduationCap,
    category: 'popular'
  },

  // DOMAIN-SPECIFIC EXAMPLES (One per service domain)
  {
    id: 'identity-citizenship',
    title: 'Citizenship & Visa Data',
    description: 'Immigration statistics, citizenship grants, visa processing',
    query: 'citizenship immigration visa migration population',
    serviceDomains: ['Identity & Status'],
    location: 'Australia',
    organization: 'Immigration',
    expectedResults: 'Immigration statistics, citizenship data, population demographics',
    icon: Users,
    category: 'domain'
  },
  {
    id: 'business-grants',
    title: 'Business Grants & Support',
    description: 'Small business funding, grants, economic development programs',
    query: 'business grants funding small business economic development',
    serviceDomains: ['Income, Work & Enterprise'],
    location: 'Australia',
    organization: 'Industry',
    expectedResults: 'Grant programs, business support data, economic development statistics',
    icon: Building,
    category: 'domain'
  },
  {
    id: 'family-payments',
    title: 'Family Support Services',
    description: 'Childcare data, family payments, parenting support programs',
    query: 'family childcare payments parenting support child',
    serviceDomains: ['Family & Care'],
    location: 'Australia',
    organization: 'Services Australia',
    expectedResults: 'Childcare statistics, family payment data, parenting program information',
    icon: Heart,
    category: 'domain'
  },
  {
    id: 'transport-infrastructure',
    title: 'Transport Infrastructure',
    description: 'Road networks, public transport, licensing data',
    query: 'transport infrastructure roads public transport licensing',
    serviceDomains: ['Mobility & Transport'],
    location: 'NSW',
    organization: 'Transport',
    expectedResults: 'Transport infrastructure data, road network information, licensing statistics',
    icon: MapPin,
    category: 'domain'
  },
  {
    id: 'environmental-monitoring',
    title: 'Environmental Data',
    description: 'Climate data, air quality, water resources, biodiversity',
    query: 'environment climate air quality water biodiversity',
    serviceDomains: ['Environment, Hazards & Recovery'],
    location: 'Australia',
    organization: 'Environment',
    expectedResults: 'Environmental monitoring data, climate statistics, conservation information',
    icon: Globe,
    category: 'domain'
  },

  // LOCATION-BASED EXAMPLES (State/Territory specific)
  {
    id: 'act-government-data',
    title: 'ACT Government Services',
    description: 'Australian Capital Territory government datasets and services',
    query: 'ACT government services data statistics territory',
    serviceDomains: [],
    location: 'ACT',
    organization: '',
    expectedResults: 'ACT-specific government data across all service areas',
    icon: MapPin,
    category: 'location'
  },
  {
    id: 'nsw-health-data',
    title: 'NSW Health Data',
    description: 'New South Wales health services and medical facility data',
    query: 'NSW health hospitals medical services healthcare',
    serviceDomains: ['Health & Wellbeing'],
    location: 'NSW',
    organization: 'Health',
    expectedResults: 'NSW hospital data, health service locations, medical statistics',
    icon: Heart,
    category: 'location'
  },
  {
    id: 'vic-education-data',
    title: 'Victorian Education Data',
    description: 'Victoria school performance, funding, and education statistics',
    query: 'Victoria education schools universities funding performance',
    serviceDomains: ['Education & Skills'],
    location: 'VIC',
    organization: 'Education',
    expectedResults: 'Victorian school data, education funding, student performance statistics',
    icon: GraduationCap,
    category: 'location'
  },
  {
    id: 'qld-disaster-data',
    title: 'Queensland Disaster Data',
    description: 'Queensland flood, cyclone, and emergency management data',
    query: 'Queensland disaster flood cyclone emergency management',
    serviceDomains: ['Environment, Hazards & Recovery'],
    location: 'QLD',
    organization: 'Emergency',
    expectedResults: 'Disaster response data, emergency management, recovery statistics',
    icon: Globe,
    category: 'location'
  },

  // ADVANCED EXAMPLES (Complex queries demonstrating power features)
  {
    id: 'multi-domain-research',
    title: 'Cross-Domain Research',
    description: 'Health and education intersection data for policy research',
    query: 'health education outcomes student wellbeing school health',
    serviceDomains: ['Health & Wellbeing', 'Education & Skills'],
    location: 'Australia',
    organization: '',
    expectedResults: 'Research datasets linking health and education outcomes',
    icon: TrendingUp,
    category: 'advanced'
  },
  {
    id: 'ato-business-data',
    title: 'ATO Business Intelligence',
    description: 'Tax office business data, industry analysis, economic indicators',
    query: 'business tax industry economic indicators financial data',
    serviceDomains: ['Taxes & Money', 'Income, Work & Enterprise'],
    location: 'Australia',
    organization: 'Australian Taxation Office',
    expectedResults: 'Business tax data, industry statistics, economic analysis',
    icon: Building,
    category: 'advanced'
  }
];

// Group examples by category for easy access
export const EXAMPLES_BY_CATEGORY = {
  popular: PRESET_EXAMPLES.filter(ex => ex.category === 'popular'),
  domain: PRESET_EXAMPLES.filter(ex => ex.category === 'domain'),
  location: PRESET_EXAMPLES.filter(ex => ex.category === 'location'),
  advanced: PRESET_EXAMPLES.filter(ex => ex.category === 'advanced')
};

// Quick access to popular examples for immediate display
export const POPULAR_EXAMPLES = EXAMPLES_BY_CATEGORY.popular;

// Helper function to apply example to search state
export const applyExample = (
  example: DatasetExample,
  setters: {
    setSearchQuery: (query: string) => void;
    setSelectedDomains: (domains: string[]) => void;
    setSelectedLocation: (location: string) => void;
    setSelectedOrganization: (org: string) => void;
    setSelectedTags: (tags: string[]) => void;
  }
) => {
  setters.setSearchQuery(example.query);
  setters.setSelectedDomains(example.serviceDomains);
  setters.setSelectedLocation(example.location || '');
  setters.setSelectedOrganization(example.organization || '');
  setters.setSelectedTags(example.tags || []);
};

// Get random examples for variety
export const getRandomExamples = (count: number = 4): DatasetExample[] => {
  const shuffled = [...PRESET_EXAMPLES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get examples by service domain
export const getExamplesByDomain = (domain: string): DatasetExample[] => {
  return PRESET_EXAMPLES.filter(ex => ex.serviceDomains.includes(domain));
};

// Get examples by location
export const getExamplesByLocation = (location: string): DatasetExample[] => {
  return PRESET_EXAMPLES.filter(ex => ex.location === location);
};