
export enum DesignPhase {
  REQUIREMENTS = 'Requirements',
  HLD = 'High Level Design',
  DATAMODEL = 'Data Model & APIs',
  LLD = 'Low Level Design (Java)',
  MACHINE_CODING = 'Machine Coding / Craft',
  DEEPDIVE = 'Deep Dives & Scaling',
  FOLLOWUPS = 'Interview Follow-ups'
}

export interface SystemDesign {
  id: string;
  name: string;
  description: string;
  sections: Record<DesignPhase, string>;
  diagramCode?: string;
  videoUri?: string;
}

export interface SystemTemplate {
  id: string;
  name: string;
  icon: string;
  prompt: string;
}
