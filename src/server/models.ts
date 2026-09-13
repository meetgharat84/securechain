export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDoc {
  _id: string;
  name: string;
  ownerId: string;
  privacy: 'private' | 'team' | 'public';
  defaultCompilerVersion: string;
  defaultAnalysisProfile: 'Quick' | 'Standard' | 'Deep';
  retentionDays: number;
  securityPreferences: {
    requireVerificationBeforeCompletion: boolean;
    beginnerFriendlyExplanations: boolean;
    analyzerLogs: boolean;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDoc {
  _id: string;
  workspaceId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractDoc {
  _id: string;
  workspaceId: string;
  projectId: string;
  name: string;
  sourceCode: string;
  sourceHash: string;
  compilerVersion: string;
  version: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisDoc {
  _id: string;
  workspaceId: string;
  projectId: string;
  contractId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  profile: 'Quick' | 'Standard' | 'Deep';
  securityScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'Secure';
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  analyzerVersions: string;
  compilerVersion: string;
  logs: string[];
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FindingDoc {
  _id: string;
  analysisId: string;
  ruleId: string;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Resolved';
  confidence: 'High' | 'Medium' | 'Low';
  functionName: string;
  lineStart: number;
  lineEnd: number;
  evidence: string;
  explanation: {
    whatHappened: string;
    whyItMatters: string;
    attackerScenario: string;
    howFixWorks: string;
  };
  remediation: string;
  detectorName: string;
  status: 'Open' | 'Resolved' | 'Ignored';
  createdAt: string;
  updatedAt: string;
}

export interface PatchDoc {
  _id: string;
  analysisId: string;
  findingIds: string[];
  originalContractId: string;
  patchedSourceCode: string;
  diff: string;
  explanation: string;
  compileStatus: 'Proposed' | 'Unverified' | 'Compile Failed' | 'Compiled' | 'Verification Running' | 'Verified' | 'Inconclusive' | 'Rejected';
  verificationStatus: 'Pending' | 'Passed' | 'Failed' | 'Inconclusive';
  gasImpact: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRunDoc {
  _id: string;
  patchId: string;
  analysisId: string;
  status: 'passed' | 'failed' | 'inconclusive';
  testName: string;
  logs: string[];
  exploitBlocked: boolean;
  findingsBefore: number;
  findingsAfter: number;
  durationMs: number;
  createdAt: string;
}
