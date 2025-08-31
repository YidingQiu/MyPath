import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  Baby,
  Briefcase,
  Building2,
  Crown,
  GraduationCap,
  Heart,
  Lightbulb,
  Plus,
  TrendingUp,
  UserPlus,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import type { Persona } from '../../app/page';
import { LogoImage } from './LogoImage';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface PersonaSelectionProps {
  onConfirm: (personas: Persona[]) => void;
  highlightPersona?: Persona;
  demoMode?: 'loss-of-job' | 'sme-support';
}

export function PersonaSelection({ onConfirm, highlightPersona, demoMode }: PersonaSelectionProps) {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [expandedCard, setExpandedCard] = useState<Persona | null>(null);

  const personas = [
    {
      id: 'citizen' as Persona,
      title: 'Citizen / Resident',
      subtitle: 'Everyday "Cruise"',
      description: 'Renewals, concessions, local community services',
      icon: Users,
      examples: ['License renewals', 'Concession cards', 'Community programs', 'Local services']
    },
    {
      id: 'newArrival' as Persona,
      title: 'New Arrival / New Citizen',
      subtitle: 'Getting Started',
      description: 'ID/enrolments, local orientation, volunteering opportunities',
      icon: UserPlus,
      examples: ['ID applications', 'School enrolments', 'Orientation programs', 'Volunteer opportunities']
    },
    {
      id: 'student' as Persona,
      title: 'Student / Learner',
      subtitle: 'Education & Career',
      description: 'Study finance, concessions, internships, first job support',
      icon: GraduationCap,
      examples: ['Student finance', 'Study concessions', 'Internship programs', 'Job placement']
    },
    {
      id: 'worker' as Persona,
      title: 'Worker / Jobseeker',
      subtitle: 'Employment Support',
      description: 'Income shock, upskilling, placement support',
      icon: Briefcase,
      examples: ['Job search assistance', 'Upskilling programs', 'Income support', 'Career counseling']
    },
    {
      id: 'careerChanger' as Persona,
      title: 'Career-changer / Side-hustler',
      subtitle: 'New Ventures',
      description: 'Training, licensing, sole-trader setup',
      icon: TrendingUp,
      examples: ['Business registration', 'Professional licensing', 'Training courses', 'Tax setup']
    },
    {
      id: 'parent' as Persona,
      title: 'Parent / Guardian',
      subtitle: 'Family Life',
      description: 'Birth→childcare→school admin; family benefits',
      icon: Baby,
      examples: ['Birth registration', 'Childcare assistance', 'School enrolment', 'Family payments']
    },
    {
      id: 'carer' as Persona,
      title: 'Carer (elder/disabled)',
      subtitle: 'Care Support',
      description: 'Respite, allowances, service coordination',
      icon: Heart,
      examples: ['Carer allowances', 'Respite services', 'Support coordination', 'Equipment funding']
    },
    {
      id: 'personWithDisability' as Persona,
      title: 'Person with Disability / NDIS Participant',
      subtitle: 'Accessibility & Support',
      description: 'Access requests, plan management',
      icon: Accessibility,
      examples: ['NDIS applications', 'Plan management', 'Accessibility modifications', 'Support services']
    },
    {
      id: 'senior' as Persona,
      title: 'Senior / Retiree',
      subtitle: 'Later Life',
      description: 'Pensions, aged care, transport concessions',
      icon: Crown,
      examples: ['Age pension', 'Aged care services', 'Seniors discounts', 'Health services']
    },
    {
      id: 'smbOwner' as Persona,
      title: 'SMB Owner / Sole Trader',
      subtitle: 'Business Operations',
      description: 'ABN/GST, ABLIS licensing, payroll/STP cadence',
      icon: Building2,
      examples: ['ABN registration', 'GST compliance', 'Payroll systems', 'Business licensing']
    },
    {
      id: 'entrepreneur' as Persona,
      title: 'Entrepreneur / Innovator',
      subtitle: 'Innovation & Growth',
      description: 'Grants, IP, pilots, procurement readiness',
      icon: Lightbulb,
      examples: ['Grant applications', 'IP protection', 'Government tenders', 'Innovation programs']
    },
    {
      id: 'disasterAffected' as Persona,
      title: 'Disaster-affected Household',
      subtitle: 'Recovery Support',
      description: 'Alerts, grants, recovery centres, rebuild steps',
      icon: AlertTriangle,
      examples: ['Emergency alerts', 'Disaster payments', 'Recovery services', 'Rebuild assistance']
    },
    {
      id: 'custom' as Persona,
      title: 'Other / Custom',
      subtitle: 'Your Unique Situation',
      description: 'Register and identify yourself as needed',
      icon: Plus,
      examples: ['Custom persona setup', 'Personalized services', 'Unique circumstances', 'Flexible support']
    }
  ];

  const handlePersonaToggle = (personaId: Persona, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPersonas(prev => 
      prev.includes(personaId)
        ? prev.filter(p => p !== personaId)
        : [...prev, personaId]
    );
  };

  const handleCardClick = (personaId: Persona) => {
    setExpandedCard(expandedCard === personaId ? null : personaId);
  };

  const handleContinue = () => {
    if (selectedPersonas.length > 0) {
      // Handle demo mode direct routing
      if (demoMode === 'loss-of-job') {
        window.location.href = '/loss-of-job/support';
        return;
      }
      if (demoMode === 'sme-support') {
        window.location.href = '/sme-support/compliance';
        return;
      }
      
      // Default behavior for main app
      onConfirm(selectedPersonas);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
              <LogoImage 
                width={80}
                height={80}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to MyPath</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your personalized government services journey
          </p>
          <p className="text-muted-foreground">
            Select one or more personas that best describe your situation
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            const isSelected = selectedPersonas.includes(persona.id);
            const isExpanded = expandedCard === persona.id;
            const isHighlighted = highlightPersona === persona.id;
            
            return (
              <Card 
                key={persona.id}
                className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] touch-manipulation ${
                  isSelected ? 'ring-2 shadow-lg bg-primary/5' : 'border-border hover:border-primary/30'
                } ${
                  isExpanded ? 'col-span-2 md:col-span-3 lg:col-span-4 shadow-xl scale-[1.02] z-10' : 'hover:shadow-lg'
                } ${
                  isHighlighted ? 'border-amber-300 bg-amber-50/30 ring-2 ring-amber-200' : ''
                }`}
                style={isSelected ? { 
                  borderColor: '#33C4E8',
                  boxShadow: '0 0 0 2px #33C4E8'
                } : {}}
                onClick={() => handleCardClick(persona.id)}
              >
                {/* Compact state - minimal info */}
                {!isExpanded && (
                  <CardHeader className="px-3 py-4 pb-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <IconComponent className="text-primary w-5 h-5" />
                      <Checkbox 
                        checked={isSelected}
                        onClick={(e) => handlePersonaToggle(persona.id, e)}
                        className="cursor-pointer h-4 w-4"
                      />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-sm leading-tight">
                        {persona.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-primary/70">
                        {persona.subtitle}
                      </CardDescription>
                    </div>
                  </CardHeader>
                )}
                
                {/* Expanded state - show full info */}
                {isExpanded && (
                  <>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className="text-primary w-8 h-8" />
                          <Checkbox 
                            checked={isSelected}
                            onClick={(e) => handlePersonaToggle(persona.id, e)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {persona.title}
                      </CardTitle>
                      <CardDescription className="text-sm font-medium text-primary/70">
                        {persona.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {persona.description}
                      </p>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground mb-2">Examples:</h4>
                        {persona.examples.map((example, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                            {example}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-xs text-primary/50 font-medium">
                        Tap to collapse
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={selectedPersonas.length === 0}
            size="lg"
            className="px-8"
          >
            Continue to Your Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {selectedPersonas.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select at least one persona to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}