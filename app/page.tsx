'use client'

import React, { useState } from 'react'
import { PersonaSelection } from '../src/components/PersonaSelection'
import { StageNavigation } from '../src/components/StageNavigation'
import { ServicesDisplay } from '../src/components/ServicesDisplay'
import { LogoImage } from '../src/components/LogoImage'
import { Button } from '../src/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export type Persona = 
  | 'citizen' 
  | 'newArrival' 
  | 'student' 
  | 'worker' 
  | 'careerChanger' 
  | 'parent' 
  | 'carer' 
  | 'personWithDisability' 
  | 'senior' 
  | 'smbOwner' 
  | 'entrepreneur' 
  | 'disasterAffected' 
  | 'custom'
export type Stage = 'new' | 'cruise' | 'choice' | 'crisis' | 'recovery' | 'closure' | 'mitigate' | 'prevent'

export default function Home() {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([])
  const [currentStage, setCurrentStage] = useState<Stage>('new')
  const [showPersonaSelection, setShowPersonaSelection] = useState(true)
  const [userQuestion, setUserQuestion] = useState<string>('')
  const [discoveredServices, setDiscoveredServices] = useState<any[]>([])

  const handlePersonaConfirm = (personas: Persona[], question: string, services?: any[]) => {
    setSelectedPersonas(personas)
    setUserQuestion(question)
    setDiscoveredServices(services || [])
    setShowPersonaSelection(false)
  }

  const handleBackToPersonas = () => {
    setShowPersonaSelection(true)
    setSelectedPersonas([])
    setCurrentStage('new')
  }

  if (showPersonaSelection) {
    return <PersonaSelection onConfirm={handlePersonaConfirm} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToPersonas}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Personas
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <LogoImage 
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold">MyPath</h1>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Your personalized service journey
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stage Navigation */}
        <StageNavigation 
          currentStage={currentStage} 
          onStageChange={setCurrentStage}
        />

        {/* Services Display */}
        <ServicesDisplay 
          personas={selectedPersonas}
          stage={currentStage}
          userQuestion={userQuestion}
          discoveredServices={discoveredServices}
        />
      </div>
    </div>
  )
}