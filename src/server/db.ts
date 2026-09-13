import type {
  UserDoc,
  WorkspaceDoc,
  ProjectDoc,
  ContractDoc,
  AnalysisDoc,
  FindingDoc,
  PatchDoc,
  VerificationRunDoc
} from './models';
import { AVATAR_URL } from '../data/mockData';
import { DEMO_VULNERABLE_VAULT_SOURCE } from '../services/securityEngine';

class DatabaseStore {
  public users: Map<string, UserDoc> = new Map();
  public workspaces: Map<string, WorkspaceDoc> = new Map();
  public projects: Map<string, ProjectDoc> = new Map();
  public contracts: Map<string, ContractDoc> = new Map();
  public analyses: Map<string, AnalysisDoc> = new Map();
  public findings: Map<string, FindingDoc> = new Map();
  public patches: Map<string, PatchDoc> = new Map();
  public verificationRuns: Map<string, VerificationRunDoc> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // 1. Default Workspace
    const defaultWorkspaceId = 'ws_default_01';
    const defaultWorkspace: WorkspaceDoc = {
      _id: defaultWorkspaceId,
      name: 'Treasury Protocols',
      ownerId: 'usr_lead_auditor',
      privacy: 'team',
      defaultCompilerVersion: '0.8.20',
      defaultAnalysisProfile: 'Standard',
      retentionDays: 90,
      securityPreferences: {
        requireVerificationBeforeCompletion: true,
        beginnerFriendlyExplanations: true,
        analyzerLogs: true,
        notifications: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.workspaces.set(defaultWorkspaceId, defaultWorkspace);

    // 2. Default User
    const defaultUser: UserDoc = {
      _id: 'usr_lead_auditor',
      name: 'Lead Protocol Auditor',
      email: 'sec@securechain.ai',
      avatar: AVATAR_URL,
      role: 'Principal Security Architect',
      workspaceId: defaultWorkspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.set(defaultUser._id, defaultUser);

    // 3. Default Project
    const defaultProject: ProjectDoc = {
      _id: 'proj_treasury_01',
      workspaceId: defaultWorkspaceId,
      name: 'Treasury Vault Security Audit',
      description: 'Production liquidation and reserve pool invariant security audit.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.projects.set(defaultProject._id, defaultProject);

    // 4. Default Contract
    const defaultContract: ContractDoc = {
      _id: 'ctr_vulnerable_vault',
      workspaceId: defaultWorkspaceId,
      projectId: defaultProject._id,
      name: 'VulnerableVault.sol',
      sourceCode: DEMO_VULNERABLE_VAULT_SOURCE,
      sourceHash: '0x8f4d92a10b',
      compilerVersion: '0.8.20',
      version: 1,
      isPrivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contracts.set(defaultContract._id, defaultContract);

    // Try loading persistent state from localStorage if running in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedWs = localStorage.getItem('securechain_workspace');
        if (savedWs) {
          const parsed = JSON.parse(savedWs);
          this.workspaces.set(defaultWorkspaceId, { ...defaultWorkspace, ...parsed });
        }
        const savedUser = localStorage.getItem('securechain_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          this.users.set(defaultUser._id, { ...defaultUser, ...parsed });
        }
      } catch {
        // ignore storage parse errors
      }
    }
  }

  public saveWorkspace(ws: WorkspaceDoc) {
    this.workspaces.set(ws._id, ws);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('securechain_workspace', JSON.stringify(ws));
      } catch (_err) {
        void _err;
      }
    }
  }

  public saveUser(user: UserDoc) {
    this.users.set(user._id, user);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('securechain_user', JSON.stringify(user));
      } catch (_err) {
        void _err;
      }
    }
  }
}

export const db = new DatabaseStore();
