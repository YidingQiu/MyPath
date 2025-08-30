import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  FileText, 
  Home, 
  Briefcase, 
  Heart, 
  Shield, 
  Building, 
  GraduationCap,
  Users,
  Phone,
  ExternalLink,
  Car,
  Vote,
  AlertTriangle,
  DollarSign,
  FileCheck,
  Monitor,
  Database,
  Clock
} from 'lucide-react';
import type { Persona, Stage } from '../../app/page';

interface ServicesDisplayProps {
  personas: Persona[];
  stage: Stage;
}

export function ServicesDisplay({ personas, stage }: ServicesDisplayProps) {
  const router = useRouter();

  const handleServiceClick = (category: string) => {
    const url = serviceUrls[category];
    const encodedName = encodeURIComponent(category);
    const encodedUrl = encodeURIComponent(url);
    router.push(`/service?name=${encodedName}&url=${encodedUrl}`);
  };
  // Australian Government Service URLs
  const serviceUrls: Record<string, string> = {
    'Identity & Status': 'https://my.gov.au/en',
    'Income, Work & Enterprise': 'https://www.servicesaustralia.gov.au/centrelink',
    'Education & Skills': 'https://www.education.gov.au/',
    'Health & Wellbeing': 'https://www.servicesaustralia.gov.au/medicare',
    'Family & Care': 'https://www.servicesaustralia.gov.au/child-support',
    'Housing & Utilities': 'https://www.dss.gov.au/housing-support',
    'Mobility & Transport': 'https://www.infrastructure.gov.au/',
    'Civic & Community': 'https://www.aec.gov.au/',
    'Safety, Justice & Consumer': 'https://www.accc.gov.au/',
    'Environment, Hazards & Recovery': 'https://www.emergency.gov.au/',
    'Taxes & Money': 'https://www.ato.gov.au/',
    'Licensing & Compliance': 'https://business.gov.au/licences-and-registrations',
    'Digital Life & Security': 'https://my.gov.au/en',
    'Research & Data Access': 'https://data.gov.au/',
    'Aging, Retirement & Legacy': 'https://www.servicesaustralia.gov.au/age-pension'
  };

  // Websites that typically block iframe embedding
  const blockedSites = [
    'my.gov.au',
    'servicesaustralia.gov.au', 
    'ato.gov.au',
    'aec.gov.au',
    'accc.gov.au'
  ];

  // Service data structure with expanded domains
  const services = {
    'Identity & Status': {
      icon: CreditCard,
      color: 'bg-blue-500',
      description: 'ID, visas, citizenship, enrolments'
    },
    'Income, Work & Enterprise': {
      icon: Briefcase,
      color: 'bg-purple-500',
      description: 'Jobs, payroll, BAS/GST, grants, procurement'
    },
    'Education & Skills': {
      icon: GraduationCap,
      color: 'bg-orange-500',
      description: 'School, VET, higher ed, recognition of prior learning'
    },
    'Health & Wellbeing': {
      icon: Heart,
      color: 'bg-red-500',
      description: 'Medicare, mental health, disability supports'
    },
    'Family & Care': {
      icon: Users,
      color: 'bg-pink-500',
      description: 'Parenting, carers, childcare, family payments'
    },
    'Housing & Utilities': {
      icon: Home,
      color: 'bg-green-500',
      description: 'Rent/ownership, concessions, energy'
    },
    'Mobility & Transport': {
      icon: Car,
      color: 'bg-blue-600',
      description: 'Licences, concessions, permits'
    },
    'Civic & Community': {
      icon: Vote,
      color: 'bg-indigo-500',
      description: 'Voting, volunteering, local events'
    },
    'Safety, Justice & Consumer': {
      icon: Shield,
      color: 'bg-gray-600',
      description: 'Police, legal aid, scams, tenancy rights'
    },
    'Environment, Hazards & Recovery': {
      icon: AlertTriangle,
      color: 'bg-yellow-600',
      description: 'Alerts, disaster payments, rebuild'
    },
    'Taxes & Money': {
      icon: DollarSign,
      color: 'bg-emerald-600',
      description: 'ATO, concessions, debt help'
    },
    'Licensing & Compliance': {
      icon: FileCheck,
      color: 'bg-teal-600',
      description: 'ABLIS, professional licences'
    },
    'Digital Life & Security': {
      icon: Monitor,
      color: 'bg-cyan-600',
      description: 'MyGov, MyID, cybersecurity, accessibility prefs'
    },
    'Research & Data Access': {
      icon: Database,
      color: 'bg-violet-600',
      description: 'Ethics, grants, data portals'
    },
    'Aging, Retirement & Legacy': {
      icon: Clock,
      color: 'bg-amber-600',
      description: 'Super, aged care, wills, estates'
    }
  };

  const getRelevantServices = () => {
    // Map personas to their most relevant service domains
    const personaServiceMapping: Record<Persona, string[]> = {
      citizen: ['Identity & Status', 'Income, Work & Enterprise', 'Health & Wellbeing', 'Housing & Utilities', 'Civic & Community', 'Taxes & Money'],
      newArrival: ['Identity & Status', 'Income, Work & Enterprise', 'Education & Skills', 'Health & Wellbeing', 'Housing & Utilities', 'Civic & Community'],
      student: ['Identity & Status', 'Education & Skills', 'Health & Wellbeing', 'Income, Work & Enterprise', 'Housing & Utilities', 'Digital Life & Security'],
      worker: ['Income, Work & Enterprise', 'Education & Skills', 'Health & Wellbeing', 'Taxes & Money', 'Digital Life & Security'],
      careerChanger: ['Income, Work & Enterprise', 'Education & Skills', 'Licensing & Compliance', 'Taxes & Money', 'Digital Life & Security'],
      parent: ['Family & Care', 'Health & Wellbeing', 'Education & Skills', 'Income, Work & Enterprise', 'Housing & Utilities'],
      carer: ['Family & Care', 'Health & Wellbeing', 'Income, Work & Enterprise', 'Taxes & Money', 'Digital Life & Security'],
      personWithDisability: ['Health & Wellbeing', 'Family & Care', 'Income, Work & Enterprise', 'Housing & Utilities', 'Mobility & Transport', 'Digital Life & Security'],
      senior: ['Health & Wellbeing', 'Aging, Retirement & Legacy', 'Taxes & Money', 'Housing & Utilities', 'Mobility & Transport'],
      smbOwner: ['Income, Work & Enterprise', 'Licensing & Compliance', 'Taxes & Money', 'Digital Life & Security', 'Research & Data Access'],
      entrepreneur: ['Income, Work & Enterprise', 'Licensing & Compliance', 'Research & Data Access', 'Digital Life & Security', 'Taxes & Money'],
      disasterAffected: ['Environment, Hazards & Recovery', 'Housing & Utilities', 'Health & Wellbeing', 'Income, Work & Enterprise', 'Safety, Justice & Consumer'],
      custom: Object.keys(services) // All domains for custom personas
    };

    const relevantDomains = new Set<string>();
    personas.forEach(persona => {
      personaServiceMapping[persona]?.forEach(domain => relevantDomains.add(domain));
    });

    return Array.from(relevantDomains).map(domain => ({
      category: domain,
      icon: services[domain as keyof typeof services].icon,
      color: services[domain as keyof typeof services].color,
      description: services[domain as keyof typeof services].description
    }));
  };

  const relevantServices = getRelevantServices();

  if (relevantServices.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
        <p className="text-muted-foreground">
          No specific services are available for your selected personas and stage combination.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Recommended Services</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {personas.map(persona => {
            const personaLabels: Record<Persona, string> = {
              citizen: 'Citizen/Resident',
              newArrival: 'New Arrival/New Citizen',
              student: 'Student/Learner',
              worker: 'Worker/Jobseeker',
              careerChanger: 'Career-changer/Side-hustler',
              parent: 'Parent/Guardian',
              carer: 'Carer',
              personWithDisability: 'Person with Disability/NDIS',
              senior: 'Senior/Retiree',
              smbOwner: 'SMB Owner/Sole Trader',
              entrepreneur: 'Entrepreneur/Innovator',
              disasterAffected: 'Disaster-affected Household',
              custom: 'Custom'
            };
            return (
              <Badge key={persona} variant="outline">
                {personaLabels[persona]}
              </Badge>
            );
          })}
        </div>
        <p className="text-muted-foreground">
          Based on your selected personas and current stage, here are the services most relevant to you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {relevantServices.map((service) => {
          const IconComponent = service.icon;
          
          return (
            <Card key={service.category} className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.category}</CardTitle>
                    <CardDescription>
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Services available based on your selected personas and current life stage.
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleServiceClick(service.category)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore {service.category} Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Information */}
      <Card className="mt-8 bg-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you can&apos;t find what you&apos;re looking for or need assistance with any of these services, 
            our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}