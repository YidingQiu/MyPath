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

  const handlePersonaToggle = (personaId: Persona) => {
    setSelectedPersonas(prev => 
      prev.includes(personaId)
        ? prev.filter(p => p !== personaId)
        : [...prev, personaId]
    );
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
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to MyPath</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your personalized government services journey
          </p>
          <p className="text-muted-foreground">
            Select one or more personas that best describe your situation
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            const isSelected = selectedPersonas.includes(persona.id);
            
            return (
              <Card 
                key={persona.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary shadow-md' : ''
                }`}
                onClick={() => handlePersonaToggle(persona.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <Checkbox 
                        checked={isSelected}
                        readOnly
                        className="pointer-events-none"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{persona.title}</CardTitle>
                  <CardDescription className="font-medium text-primary/70">
                    {persona.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {persona.description}
                  </p>
                  <div className="space-y-1">
                    {persona.examples.map((example, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                        {example}
                      </div>
                    ))}
                  </div>
                </CardContent>
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