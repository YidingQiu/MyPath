import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  Anchor, 
  GitBranch, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle 
} from 'lucide-react';
import type { Stage } from '../App';

interface StageNavigationProps {
  currentStage: Stage;
  onStageChange: (stage: Stage) => void;
}

export function StageNavigation({ currentStage, onStageChange }: StageNavigationProps) {
  const stages = [
    {
      id: 'new' as Stage,
      title: 'New',
      description: 'Starting fresh, new beginnings',
      icon: Sparkles,
      color: 'bg-blue-500'
    },
    {
      id: 'cruise' as Stage,
      title: 'Cruise',
      description: 'Stable, routine operations',
      icon: Anchor,
      color: 'bg-green-500'
    },
    {
      id: 'choice' as Stage,
      title: 'Choice',
      description: 'Decision points, options to consider',
      icon: GitBranch,
      color: 'bg-purple-500'
    },
    {
      id: 'crisis' as Stage,
      title: 'Crisis',
      description: 'Challenges requiring immediate attention',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      id: 'recovery' as Stage,
      title: 'Recovery',
      description: 'Rebuilding and getting back on track',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      id: 'closure' as Stage,
      title: 'Closure',
      description: 'Completion, ending, or transition',
      icon: CheckCircle,
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Life Stage Journey</h2>
        <p className="text-muted-foreground">
          Select the stage that best represents your current situation to see relevant services
        </p>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between mb-6">
        {stages.map((stage, index) => {
          const IconComponent = stage.icon;
          const isActive = currentStage === stage.id;
          const isPast = stages.findIndex(s => s.id === currentStage) > index;
          
          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="lg"
                  onClick={() => onStageChange(stage.id)}
                  className={`w-16 h-16 rounded-full p-0 mb-2 ${
                    isActive ? '' : isPast ? 'bg-muted text-muted-foreground' : ''
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </Button>
                <div className="text-center">
                  <div className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stage.title}
                  </div>
                  <div className="text-xs text-muted-foreground max-w-20">
                    {stage.description}
                  </div>
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="flex-1 h-px bg-border mx-4 mt-8" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden grid grid-cols-3 gap-3 mb-6">
        {stages.map((stage) => {
          const IconComponent = stage.icon;
          const isActive = currentStage === stage.id;
          
          return (
            <Button
              key={stage.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onStageChange(stage.id)}
              className="flex flex-col gap-2 h-auto p-4"
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs">{stage.title}</span>
            </Button>
          );
        })}
      </div>

      {/* Current Stage Info */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            Current Stage
          </Badge>
          <h3 className="font-semibold">
            {stages.find(s => s.id === currentStage)?.title}
          </h3>
        </div>
        <p className="text-muted-foreground mt-2">
          {stages.find(s => s.id === currentStage)?.description}
        </p>
      </div>
    </div>
  );
}