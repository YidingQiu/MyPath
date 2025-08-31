// Simple workflow state management for bushfire disaster demo
export type BushfireWorkflowState = {
  alertAcknowledged: boolean;
  evacuationStarted: boolean;
  arrivedAtCenter: boolean;
  reliefRegistered: boolean;
  planAccepted: boolean;
  stepsCompleted: number[];
}

const WORKFLOW_STATE_KEY = 'bushfire-disaster-workflow-state';

export const getBushfireWorkflowState = (): BushfireWorkflowState => {
  if (typeof window === 'undefined') {
    return {
      alertAcknowledged: false,
      evacuationStarted: false,
      arrivedAtCenter: false,
      reliefRegistered: false,
      planAccepted: false,
      stepsCompleted: [],
    };
  }

  const stored = localStorage.getItem(WORKFLOW_STATE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback to default state
    }
  }

  return {
    alertAcknowledged: false,
    evacuationStarted: false,
    arrivedAtCenter: false,
    reliefRegistered: false,
    planAccepted: false,
    stepsCompleted: [],
  };
};

export const updateBushfireWorkflowState = (updates: Partial<BushfireWorkflowState>) => {
  if (typeof window === 'undefined') return;
  
  const currentState = getBushfireWorkflowState();
  const newState = { ...currentState, ...updates };
  localStorage.setItem(WORKFLOW_STATE_KEY, JSON.stringify(newState));
};

export const resetBushfireWorkflowState = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WORKFLOW_STATE_KEY);
};