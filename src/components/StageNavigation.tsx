import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  Anchor, 
  GitBranch, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  Shield,
  ShieldCheck
} from 'lucide-react';
import type { Stage } from '../../app/page';

interface StageNavigationProps {
  currentStage: Stage;
  onStageChange: (stage: Stage) => void;
}

export function StageNavigation({ currentStage, onStageChange }: StageNavigationProps) {
  const stages = [
    {
      id: 'new' as Stage,
      title: 'New',
      description: 'Set things up and get connected fast',
      icon: Sparkles,
      color: 'bg-blue-500'
    },
    {
      id: 'cruise' as Stage,
      title: 'Cruise',
      description: 'Keep life admin humming with light tune-ups',
      icon: Anchor,
      color: 'bg-green-500'
    },
    {
      id: 'choice' as Stage,
      title: 'Choice',
      description: 'Compare paths and pick the best fit',
      icon: GitBranch,
      color: 'bg-purple-500'
    },
    {
      id: 'crisis' as Stage,
      title: 'Crisis',
      description: 'Stabilise quickly with the fewest critical steps',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      id: 'recovery' as Stage,
      title: 'Recovery',
      description: 'Rebuild methodically and close follow-ups',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      id: 'closure' as Stage,
      title: 'Closure',
      description: 'Wind down cleanly and hand things over',
      icon: CheckCircle,
      color: 'bg-gray-500'
    }
  ];

  const riskManagementStages = [
    {
      id: 'mitigate' as Stage,
      title: 'Mitigate',
      description: 'Reduce the severity or impact of a risk in progress',
      icon: Shield,
      color: 'bg-amber-600'
    },
    {
      id: 'prevent' as Stage,
      title: 'Prevent',
      description: 'Stop a risk from occurring or reduce its likelihood',
      icon: ShieldCheck,
      color: 'bg-emerald-700'
    }
  ];

  const allStages = [...stages, ...riskManagementStages];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Journey Stage</h2>
        <p className="text-muted-foreground">
          Select the stage that best represents your current situation to see relevant services
        </p>
      </div>
      
      {/* Life Stages - Desktop Navigation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Life Stages</h3>
        <div className="hidden md:flex items-center justify-between mb-4">
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
                  style={isActive ? {
                    backgroundColor: '#33C4E8',
                    borderColor: '#33C4E8',
                    color: 'white'
                  } : {}}
                >
                  <IconComponent className="w-6 h-6" />
                </Button>
                <div className="text-center">
                  <div className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stage.title}
                  </div>
                  <div className="text-xs text-muted-foreground max-w-24">
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

      {/* Life Stages - Mobile Navigation */}
      <div className="md:hidden grid grid-cols-3 gap-3 mb-4">
        {stages.map((stage) => {
          const IconComponent = stage.icon;
          const isActive = currentStage === stage.id;
          
          return (
            <Button
              key={stage.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onStageChange(stage.id)}
              className="flex flex-col gap-2 h-auto p-3"
              style={isActive ? {
                backgroundColor: '#33C4E8',
                borderColor: '#33C4E8',
                color: 'white'
              } : {}}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-xs">{stage.title}</span>
            </Button>
          );
        })}
      </div>
      </div>

      {/* Risk Management Stream - Optional/Secondary */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Risk Management (Optional)</h4>
        <div className="flex gap-2 flex-wrap">
          {riskManagementStages.map((stage) => {
            const IconComponent = stage.icon;
            const isActive = currentStage === stage.id;
            
            return (
              <Button
                key={stage.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onStageChange(stage.id)}
                className="flex items-center gap-2 h-auto p-2 text-xs"
                style={isActive ? {
                  backgroundColor: '#33C4E8',
                  borderColor: '#33C4E8',
                  color: 'white'
                } : {}}
              >
                <IconComponent className="w-3 h-3" />
                <span>{stage.title}</span>
              </Button>
            );
          })}
          {/* No Risk Management Option */}
          <Button
            variant={!['mitigate', 'prevent'].includes(currentStage) ? "outline" : "ghost"}
            size="sm"
            onClick={() => onStageChange('new')}
            className="flex items-center gap-2 h-auto p-2 text-xs text-muted-foreground"
          >
            <span>None</span>
          </Button>
        </div>
      </div>

      {/* Current Stage Info */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            Current Stage
          </Badge>
          <h3 className="font-semibold">
            {allStages.find(s => s.id === currentStage)?.title}
          </h3>
        </div>
        <p className="text-muted-foreground mt-2">
          {allStages.find(s => s.id === currentStage)?.description}
        </p>
      </div>
    </div>
  );
}