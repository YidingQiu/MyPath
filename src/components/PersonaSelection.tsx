import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Users, UserPlus, GraduationCap, ArrowRight } from 'lucide-react';
import type { Persona } from '../App';

interface PersonaSelectionProps {
  onConfirm: (personas: Persona[]) => void;
}

export function PersonaSelection({ onConfirm }: PersonaSelectionProps) {
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
      onConfirm(selectedPersonas);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 transform rotate-12">
                  <div className="w-full h-2 bg-black rounded-full mb-2"></div>
                  <div className="w-full h-2 bg-black rounded-full transform rotate-45 origin-left"></div>
                </div>
              </div>
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
        <div className="grid grid-cols-3 gap-3 mb-8">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            const isSelected = selectedPersonas.includes(persona.id);
            const isExpanded = expandedCard === persona.id;
            
            return (
              <Card 
                key={persona.id}
                className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] touch-manipulation ${
                  isSelected ? 'ring-2 ring-primary border-primary shadow-lg bg-primary/5' : 'border-border hover:border-primary/30'
                } ${
                  isExpanded ? 'col-span-3 shadow-xl scale-[1.02] z-10' : 'hover:shadow-lg'
                }`}
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