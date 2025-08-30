// Simple workflow state management for demo
export type WorkflowState = {
  assessmentCompleted: boolean;
  bundlesViewed: boolean;
  calendarViewed: boolean;
  detailedObligationsViewed: boolean;
}

const WORKFLOW_STATE_KEY = 'sme-support-workflow-state';

export const getWorkflowState = (): WorkflowState => {
  if (typeof window === 'undefined') {
    return {
      assessmentCompleted: false,
      bundlesViewed: false,
      calendarViewed: false,
      detailedObligationsViewed: false,
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
    assessmentCompleted: false,
    bundlesViewed: false,
    calendarViewed: false,
    detailedObligationsViewed: false,
  };
};

export const updateWorkflowState = (updates: Partial<WorkflowState>) => {
  if (typeof window === 'undefined') return;
  
  const currentState = getWorkflowState();
  const newState = { ...currentState, ...updates };
  localStorage.setItem(WORKFLOW_STATE_KEY, JSON.stringify(newState));
};

export const resetWorkflowState = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WORKFLOW_STATE_KEY);
};