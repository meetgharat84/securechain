export type AppScreen = 
  | 'landing'
  | 'login'
  | 'register'
  | 'overview'
  | 'patch-review'
  | 'attack-replay'
  | 'new-analysis'
  | 'scan-progress'
  | 'scan-history'
  | 'projects'
  | 'demo-gallery'
  | 'methodology'
  | 'settings'
  | 'profile'
  | 'compare';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved';

export interface FindingExplanation {
  whatHappened: string;
  whyItMatters: string;
  attackerScenario: string;
  howFixWorks: string;
}

export interface Finding {
  id: string;
  findingNumber: string;
  title: string;
  severity: Severity;
  detector: string;
  lines: string;
  startLine: number;
  endLine: number;
  swcId: string;
  cweId?: string;
  confidence?: 'High' | 'Medium' | 'Low';
  functionName?: string;
  description: string;
  evidence: string;
  preconditions?: string[];
  recommendation: string;
  explanationDetails?: FindingExplanation;
  patchCode?: string;
  originalCodeSnippet?: string;
  patchedCodeSnippet?: string;
  status?: 'Open' | 'Resolved' | 'Ignored';
}

export interface ContractFile {
  id: string;
  name: string;
  path: string;
  protocol: string;
  solidityVersion: string;
  score: number;
  commit: string;
  scannedAt: string;
  reportId: string;
  findings: Finding[];
  fullSource: string;
}

export interface ReplayStep {
  step: number;
  title: string;
  description: string;
  gas: string;
  status: 'passed' | 'revert' | 'nominal';
  highlightCode?: string;
}

export interface ScanRecord {
  id: string;
  target: string;
  contract: string;
  score: number;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  commit: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Failed';
}
