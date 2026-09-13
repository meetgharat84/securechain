import { z } from 'zod';
import { db } from './db';
import type { UserDoc, WorkspaceDoc, AnalysisDoc, PatchDoc, VerificationRunDoc } from './models';
import { DeterministicSecurityEngine } from '../services/securityEngine';
import { AIService } from '../services/aiService';
import { CompilerAndVerifierService } from '../services/compilerAndVerifier';
import { AuthService, DEMO_MODE } from '../services/authService';

// Request Validation Schemas
export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').optional(),
  role: z.string().optional(),
});

export const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  privacy: z.enum(['private', 'team', 'public']),
  defaultCompilerVersion: z.string(),
  defaultAnalysisProfile: z.enum(['Quick', 'Standard', 'Deep']),
  retentionDays: z.number().min(1).max(365),
  securityPreferences: z.object({
    requireVerificationBeforeCompletion: z.boolean(),
    beginnerFriendlyExplanations: z.boolean(),
    analyzerLogs: z.boolean(),
    notifications: z.boolean(),
  }),
});

export const StartAnalysisSchema = z.object({
  contractName: z.string().min(1),
  sourceCode: z.string().min(10, 'Solidity source code is required'),
  compilerVersion: z.string().default('0.8.20'),
  profile: z.enum(['Quick', 'Standard', 'Deep']).default('Standard'),
  projectId: z.string().optional(),
});

export class ApiService {
  /**
   * Get currently logged-in user from authenticated session
   */
  public static async getCurrentUser(): Promise<UserDoc> {
    const authUser = AuthService.getCurrentUser();
    if (authUser) {
      const fromDb = db.users.get(authUser._id);
      return fromDb || authUser;
    }
    if (DEMO_MODE) {
      const user = Array.from(db.users.values())[0];
      if (user) return user;
    }
    throw new Error('Unauthenticated: No active user session found.');
  }

  /**
   * Update user profile
   */
  public static async updateProfile(data: z.infer<typeof UpdateProfileSchema>): Promise<UserDoc> {
    const valid = UpdateProfileSchema.parse(data);
    const user = await this.getCurrentUser();
    const updated: UserDoc = {
      ...user,
      name: valid.name.trim(),
      email: user.email, // email is strictly preserved from authenticated account
      role: valid.role !== undefined ? valid.role : user.role,
      updatedAt: new Date().toISOString(),
    };
    db.saveUser(updated);
    AuthService.updateCurrentUser(updated);
    return updated;
  }

  /**
   * Get workspace settings
   */
  public static async getWorkspace(): Promise<WorkspaceDoc> {
    const ws = Array.from(db.workspaces.values())[0];
    if (!ws) throw new Error('Workspace not found');
    return ws;
  }

  /**
   * Update workspace settings
   */
  public static async updateWorkspace(data: Partial<WorkspaceDoc>): Promise<WorkspaceDoc> {
    const ws = await this.getWorkspace();
    const updated: WorkspaceDoc = {
      ...ws,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    db.saveWorkspace(updated);
    return updated;
  }

  /**
   * Start a new security analysis
   */
  public static async startAnalysis(params: z.infer<typeof StartAnalysisSchema>): Promise<AnalysisDoc> {
    const valid = StartAnalysisSchema.parse(params);

    // Validate Solidity source
    const validation = DeterministicSecurityEngine.validateSource(valid.sourceCode);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid Solidity code');
    }

    const ws = await this.getWorkspace();
    const analysisId = 'an_' + Math.random().toString(36).substring(2, 9);
    const contractId = 'ctr_' + Math.random().toString(36).substring(2, 9);

    // Save Contract
    db.contracts.set(contractId, {
      _id: contractId,
      workspaceId: ws._id,
      projectId: valid.projectId || 'proj_treasury_01',
      name: valid.contractName,
      sourceCode: valid.sourceCode,
      sourceHash: '0x' + Math.random().toString(36).substring(2, 10),
      compilerVersion: valid.compilerVersion,
      version: 1,
      isPrivate: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Run deterministic analyzer
    const analysisResult = DeterministicSecurityEngine.analyzeContract(valid.sourceCode, valid.contractName);

    // Save Findings
    analysisResult.findings.forEach((f) => {
      const findingId = 'f_' + Math.random().toString(36).substring(2, 9);
      db.findings.set(findingId, {
        _id: findingId,
        analysisId,
        ruleId: f.detector,
        title: f.title,
        category: f.detector,
        severity: f.severity,
        confidence: f.confidence,
        functionName: f.functionName,
        lineStart: f.lineStart,
        lineEnd: f.lineEnd,
        evidence: f.evidence,
        explanation: f.explanation,
        remediation: f.remediation,
        detectorName: f.detectorName,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    // Create Analysis Doc
    const analysisDoc: AnalysisDoc = {
      _id: analysisId,
      workspaceId: ws._id,
      projectId: valid.projectId || 'proj_treasury_01',
      contractId,
      status: 'completed',
      profile: valid.profile,
      securityScore: analysisResult.securityScore,
      riskLevel: analysisResult.riskLevel,
      totalFindings: analysisResult.totalFindings,
      criticalCount: analysisResult.criticalCount,
      highCount: analysisResult.highCount,
      mediumCount: analysisResult.mediumCount,
      lowCount: analysisResult.lowCount,
      analyzerVersions: analysisResult.analyzerVersions,
      compilerVersion: valid.compilerVersion,
      logs: analysisResult.logs,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.analyses.set(analysisId, analysisDoc);
    return analysisDoc;
  }

  /**
   * Get report by analysisId
   */
  public static async getReport(analysisId: string) {
    const analysis = db.analyses.get(analysisId);
    if (!analysis) throw new Error(`Report not found for ID ${analysisId}`);
    const contract = db.contracts.get(analysis.contractId);
    const findings = Array.from(db.findings.values()).filter((f) => f.analysisId === analysisId);

    return {
      analysis,
      contract,
      findings,
    };
  }

  /**
   * Generate explanation and patch
   */
  public static async generatePatch(findingId: string) {
    const finding = db.findings.get(findingId);
    if (!finding) throw new Error('Finding not found');
    const analysis = db.analyses.get(finding.analysisId);
    const contract = analysis ? db.contracts.get(analysis.contractId) : null;
    const source = contract ? contract.sourceCode : '';

    const { data, isAIAssisted } = await AIService.generatePatchAndExplanation(
      {
        id: finding._id,
        findingNumber: 'FINDING #01',
        title: finding.title,
        severity: finding.severity,
        confidence: finding.confidence,
        detector: finding.ruleId,
        functionName: finding.functionName,
        lines: `L${finding.lineStart}-${finding.lineEnd}`,
        lineStart: finding.lineStart,
        lineEnd: finding.lineEnd,
        swcId: 'SWC-107',
        description: finding.explanation.whatHappened,
        evidence: finding.evidence,
        explanation: finding.explanation,
        remediation: finding.remediation,
        status: finding.status,
        detectorName: finding.detectorName,
      },
      source
    );

    const patchId = 'patch_' + Math.random().toString(36).substring(2, 9);
    const patchDoc: PatchDoc = {
      _id: patchId,
      analysisId: finding.analysisId,
      findingIds: [findingId],
      originalContractId: contract ? contract._id : '',
      patchedSourceCode: data.patchedCode,
      diff: `--- a/${contract?.name || 'VulnerableVault.sol'}\n+++ b/${contract?.name || 'VulnerableVault.sol'}\n@@ -13,10 +13,14 @@\n+ import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";`,
      explanation: data.summary,
      compileStatus: 'Proposed',
      verificationStatus: 'Pending',
      gasImpact: '-180 gas / +0.4% deployment overhead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.patches.set(patchId, patchDoc);
    return { patch: patchDoc, aiResponse: data, isAIAssisted };
  }

  /**
   * Compile patch
   */
  public static async compilePatch(patchId: string) {
    const patch = db.patches.get(patchId);
    if (!patch) throw new Error('Patch not found');
    const res = await CompilerAndVerifierService.compileContract(patch.patchedSourceCode);
    patch.compileStatus = res.success ? 'Compiled' : 'Compile Failed';
    patch.updatedAt = new Date().toISOString();
    db.patches.set(patchId, patch);
    return res;
  }

  /**
   * Verify patch
   */
  public static async verifyPatch(patchId: string) {
    const patch = db.patches.get(patchId);
    if (!patch) throw new Error('Patch not found');
    const findings = Array.from(db.findings.values()).filter((f) => f.analysisId === patch.analysisId);

    const res = await CompilerAndVerifierService.verifyPatch(
      patch.patchedSourceCode,
      findings.map((f) => ({
        id: f._id,
        findingNumber: 'FINDING #01',
        title: f.title,
        severity: f.severity,
        confidence: f.confidence,
        detector: f.ruleId,
        functionName: f.functionName,
        lines: `L${f.lineStart}-${f.lineEnd}`,
        lineStart: f.lineStart,
        lineEnd: f.lineEnd,
        swcId: 'SWC-107',
        description: f.explanation.whatHappened,
        evidence: f.evidence,
        explanation: f.explanation,
        remediation: f.remediation,
        status: f.status,
        detectorName: f.detectorName,
      })),
      patchId,
      patch.analysisId
    );

    patch.verificationStatus = res.status === 'passed' ? 'Passed' : 'Failed';
    patch.compileStatus = res.status === 'passed' ? 'Verified' : 'Inconclusive';
    patch.updatedAt = new Date().toISOString();
    db.patches.set(patchId, patch);

    const vrunId = 'vrun_' + Math.random().toString(36).substring(2, 9);
    const vrunDoc: VerificationRunDoc = {
      _id: vrunId,
      patchId,
      analysisId: patch.analysisId,
      status: res.status,
      testName: res.testName,
      logs: res.logs,
      exploitBlocked: res.exploitBlocked,
      findingsBefore: res.findingsBefore,
      findingsAfter: res.findingsAfter,
      durationMs: res.durationMs,
      createdAt: new Date().toISOString(),
    };
    db.verificationRuns.set(vrunId, vrunDoc);

    return res;
  }
}
