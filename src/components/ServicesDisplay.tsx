import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
  ExternalLink
} from 'lucide-react';
import type { Persona, Stage } from '../App';

interface ServicesDisplayProps {
  personas: Persona[];
  stage: Stage;
}

export function ServicesDisplay({ personas, stage }: ServicesDisplayProps) {
  // Service data structure
  const services = {
    'Identity & Status': {
      icon: CreditCard,
      color: 'bg-blue-500',
      items: {
        citizen: {
          new: ['Driver License Application', 'Voter Registration', 'Medicare Card'],
          cruise: ['License Renewal', 'Address Update', 'Passport Renewal'],
          choice: ['Name Change Certificate', 'Citizenship Application'],
          crisis: ['Emergency ID Replacement', 'Temporary Documents'],
          recovery: ['ID Restoration Services', 'Document Recovery'],
          closure: ['Account Closure', 'Final Documentation']
        },
        newArrival: {
          new: ['TFN Application', 'Bank Account Setup', 'Centrelink Registration'],
          cruise: ['Permanent Residence Application', 'Work Rights Verification'],
          choice: ['Citizenship Pathway', 'Visa Extension Options'],
          crisis: ['Immigration Legal Aid', 'Emergency Support'],
          recovery: ['Status Restoration', 'Appeal Processes'],
          closure: ['Departure Documentation', 'Exit Requirements']
        },
        student: {
          new: ['Student ID Card', 'Concession Card', 'Youth Allowance'],
          cruise: ['International Student Services', 'Work Permit'],
          choice: ['Course Transfer', 'Study Abroad Programs'],
          crisis: ['Academic Support', 'Financial Hardship Aid'],
          recovery: ['Re-enrollment Services', 'Credit Recovery'],
          closure: ['Graduation Services', 'Alumni Registration']
        }
      }
    },
    'Housing & Community': {
      icon: Home,
      color: 'bg-green-500',
      items: {
        citizen: {
          new: ['Housing Application', 'Utility Connections', 'Local Services Guide'],
          cruise: ['Property Services', 'Council Services', 'Community Programs'],
          choice: ['Relocation Support', 'Housing Options'],
          crisis: ['Emergency Housing', 'Homelessness Support'],
          recovery: ['Housing Assistance', 'Rehabilitation Programs'],
          closure: ['Lease Termination', 'Moving Services']
        },
        newArrival: {
          new: ['Settlement Services', 'Temporary Accommodation', 'Orientation Programs'],
          cruise: ['Community Integration', 'Language Classes', 'Cultural Programs'],
          choice: ['Permanent Housing Options', 'Suburb Selection'],
          crisis: ['Crisis Accommodation', 'Support Networks'],
          recovery: ['Rebuilding Support', 'Community Connections'],
          closure: ['Relocation Services', 'Departure Support']
        },
        student: {
          new: ['Student Accommodation', 'Campus Housing', 'Share House Guide'],
          cruise: ['Student Communities', 'Study Groups', 'Campus Life'],
          choice: ['Housing Options', 'Location Changes'],
          crisis: ['Emergency Accommodation', 'Student Welfare'],
          recovery: ['Housing Support', 'Counseling Services'],
          closure: ['End of Study Housing', 'Graduate Transition']
        }
      }
    },
    'Employment & Finance': {
      icon: Briefcase,
      color: 'bg-purple-500',
      items: {
        citizen: {
          new: ['Job Search Services', 'Centrelink Registration', 'Skills Assessment'],
          cruise: ['Career Development', 'Training Programs', 'Tax Services'],
          choice: ['Career Change Support', 'Retraining Options'],
          crisis: ['Unemployment Benefits', 'Financial Counseling'],
          recovery: ['Back to Work Programs', 'Skill Building'],
          closure: ['Retirement Planning', 'Superannuation']
        },
        newArrival: {
          new: ['Work Rights Information', 'Job Readiness Programs', 'Professional Recognition'],
          cruise: ['Career Building', 'Professional Networks', 'Skill Development'],
          choice: ['Career Pathways', 'Further Education'],
          crisis: ['Employment Legal Aid', 'Workplace Support'],
          recovery: ['Re-employment Services', 'Skill Recognition'],
          closure: ['Final Pay Processing', 'Work History Certification']
        },
        student: {
          new: ['Part-time Work Guide', 'Internship Programs', 'Student Finance'],
          cruise: ['Work-Study Balance', 'Professional Development', 'Industry Connections'],
          choice: ['Career Exploration', 'Major Selection'],
          crisis: ['Financial Aid', 'Emergency Funds', 'Academic Support'],
          recovery: ['Academic Recovery', 'Financial Planning'],
          closure: ['Graduate Employment', 'Career Placement']
        }
      }
    },
    'Health & Wellbeing': {
      icon: Heart,
      color: 'bg-red-500',
      items: {
        citizen: {
          new: ['Medicare Registration', 'GP Registration', 'Health Checks'],
          cruise: ['Regular Healthcare', 'Preventive Services', 'Mental Health'],
          choice: ['Health Options', 'Specialist Referrals'],
          crisis: ['Emergency Services', 'Crisis Support', 'Mental Health Crisis'],
          recovery: ['Rehabilitation', 'Recovery Programs', 'Ongoing Support'],
          closure: ['End of Life Planning', 'Final Healthcare']
        },
        newArrival: {
          new: ['Health System Orientation', 'Vaccination Records', 'Health Assessments'],
          cruise: ['Community Health', 'Cultural Health Services', 'Family Health'],
          choice: ['Healthcare Options', 'Provider Selection'],
          crisis: ['Emergency Healthcare', 'Interpreter Services'],
          recovery: ['Health Recovery', 'Support Services'],
          closure: ['Health Records Transfer', 'Final Health Services']
        },
        student: {
          new: ['Student Health Services', 'Campus Medical', 'Mental Health Support'],
          cruise: ['Ongoing Health', 'Counseling Services', 'Wellness Programs'],
          choice: ['Health Plan Selection', 'Provider Options'],
          crisis: ['Crisis Counseling', 'Emergency Support'],
          recovery: ['Health Recovery', 'Academic Support'],
          closure: ['Health Transition', 'Graduate Health Services']
        }
      }
    }
  };

  const getRelevantServices = () => {
    const relevantServices: Array<{
      category: string;
      icon: any;
      color: string;
      items: string[];
    }> = [];

    Object.entries(services).forEach(([category, service]) => {
      const items = new Set<string>();
      
      personas.forEach(persona => {
        const personaServices = service.items[persona]?.[stage] || [];
        personaServices.forEach(item => items.add(item));
      });

      if (items.size > 0) {
        relevantServices.push({
          category,
          icon: service.icon,
          color: service.color,
          items: Array.from(items)
        });
      }
    });

    return relevantServices;
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
            const personaLabels = {
              citizen: 'Citizen/Resident',
              newArrival: 'New Arrival/New Citizen',
              student: 'Student/Learner'
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
                      {service.items.length} service{service.items.length !== 1 ? 's' : ''} available
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {service.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{item}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
            If you can't find what you're looking for or need assistance with any of these services, 
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