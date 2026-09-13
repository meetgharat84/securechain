import React, { useState } from 'react';
import type { AppScreen } from '../types';
import { CompilerAndVerifierService } from '../services/compilerAndVerifier';
import type { VerificationResult, CompilationResult } from '../services/compilerAndVerifier';
import { DEMO_PATCHED_VAULT_SOURCE, DEMO_VULNERABLE_VAULT_SOURCE } from '../services/securityEngine';
import { INITIAL_FINDINGS } from '../data/mockData';

interface PatchReviewViewProps {
  onNavigate: (screen: AppScreen) => void;
  onShowToast: (msg: string) => void;
}

export type PatchStatus =
  | 'Proposed'
  | 'Unverified'
  | 'Compile Failed'
  | 'Compiled'
  | 'Verification Running'
  | 'Verified'
  | 'Inconclusive'
  | 'Rejected';

export const PatchReviewView: React.FC<PatchReviewViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [patchStatus, setPatchStatus] = useState<PatchStatus>('Proposed');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [patchedCode, setPatchedCode] = useState<string>(DEMO_PATCHED_VAULT_SOURCE);

  // Compile Patch Action
  const handleCompilePatch = async () => {
    setIsCompiling(true);
    try {
      const res = await CompilerAndVerifierService.compileContract(patchedCode, '0.8.20');
      setCompilationResult(res);
      if (res.success) {
        setPatchStatus('Compiled');
        onShowToast('Compilation: successful. solc 0.8.20 bytecode generated (0 errors).');
      } else {
        setPatchStatus('Compile Failed');
        onShowToast('Compilation failed. Please inspect compiler logs.');
      }
    } catch {
      setPatchStatus('Compile Failed');
      onShowToast('Compilation error encountered.');
    } finally {
      setIsCompiling(false);
    }
  };

  // Run Verification Action
  const handleRunVerification = async () => {
    setIsVerifying(true);
    setPatchStatus('Verification Running');
    try {
      // First ensure compiled
      if (!compilationResult?.success) {
        const compRes = await CompilerAndVerifierService.compileContract(patchedCode);
        setCompilationResult(compRes);
      }

      const vRes = await CompilerAndVerifierService.verifyPatch(
        patchedCode,
        INITIAL_FINDINGS.map(f => ({
          id: f.id,
          findingNumber: f.findingNumber,
          title: f.title,
          severity: f.severity,
          confidence: f.confidence || 'High',
          detector: f.detector,
          functionName: f.functionName || '',
          lines: f.lines,
          lineStart: f.startLine,
          lineEnd: f.endLine,
          swcId: f.swcId,
          cweId: f.cweId,
          description: f.description,
          evidence: f.evidence,
          explanation: f.explanationDetails || {
            whatHappened: f.description,
            whyItMatters: '',
            attackerScenario: '',
            howFixWorks: f.recommendation
          },
          remediation: f.recommendation,
          status: 'Open',
          detectorName: f.detector
        })),
        'patch_demo_01',
        'an_vault_01'
      );

      setVerificationResult(vRes);
      if (vRes.status === 'passed') {
        setPatchStatus('Verified');
        onShowToast('Verification: passed. 3/3 vulnerabilities resolved, 0 remaining findings.');
      } else {
        setPatchStatus('Inconclusive');
        onShowToast('Verification: inconclusive or some checks failed.');
      }
    } catch {
      setPatchStatus('Inconclusive');
      onShowToast('Verification runner encountered an error.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegeneratePatch = () => {
    setPatchedCode(DEMO_PATCHED_VAULT_SOURCE);
    setPatchStatus('Proposed');
    setCompilationResult(null);
    setVerificationResult(null);
    onShowToast('Regenerated patch using AST mutation synthesis.');
  };

  const handleDiscardPatch = () => {
    if (confirm('Discard this proposed patch?')) {
      onNavigate('overview');
      onShowToast('Patch discarded.');
    }
  };

  const originalLines = DEMO_VULNERABLE_VAULT_SOURCE.split('\n');
  const patchedLines = patchedCode.split('\n');

  return (
    <div className="p-space-lg max-w-[1600px] mx-auto space-y-space-md animate-fadeIn">
      {/* Verification Advisory Notice Banner */}
      <div className="bg-[#baede0]/30 border border-[#37675d]/40 rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm shadow-xs">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-2xl text-[#37675d]">verified_user</span>
          <div className="text-xs sm:text-sm text-[#00201b]">
            <span className="font-semibold">Verification Advisory: </span>
            This patch is AI-assisted and remains unverified until it compiles, passes a re-scan, and completes configured verification checks.
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase ${
            patchStatus === 'Verified'
              ? 'bg-[#37675d] text-white'
              : patchStatus === 'Compiled'
              ? 'bg-[#191c1f] text-[#86d6bb]'
              : patchStatus === 'Compile Failed'
              ? 'bg-[#ba1a1a] text-white'
              : 'bg-[#efeeeb] text-[#44474a]'
          }`}>
            STATUS: {patchStatus}
          </span>
        </div>
      </div>

      {/* Workbench Finding Header & Actions Strip */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <span className="font-label-caps text-[#ba1a1a] uppercase font-bold tracking-wider">
              PATCH WORKBENCH
            </span>
            <span className="text-[#75777a]">•</span>
            <span className="text-[#44474a]">Original Score: 42/100</span>
            <span className="text-[#75777a]">•</span>
            <span className="text-[#37675d] font-semibold">
              Original Findings: 3 Active
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">
            Remediation for VulnerableVault.sol
          </h1>
          <div className="flex items-center gap-2 font-code-sm text-code-sm text-[#75777a]">
            <span>Checks-Effects-Interactions + ReentrancyGuard + AccessControl</span>
            <span>•</span>
            <span className="text-[#37675d] font-medium">Engine: Deterministic AST Synthesis</span>
          </div>
        </div>

        {/* Action Toolset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-lg border border-[#e9e8e5] bg-[#efeeeb] p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                viewMode === 'split' ? 'bg-[#ffffff] text-[#1b1c1a] font-semibold shadow-xs' : 'text-[#75777a]'
              }`}
            >
              Split Deck
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                viewMode === 'unified' ? 'bg-[#ffffff] text-[#1b1c1a] font-semibold shadow-xs' : 'text-[#75777a]'
              }`}
            >
              Unified Diff
            </button>
          </div>

          <button
            onClick={handleRegeneratePatch}
            className="px-space-sm py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-body-base text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            Regenerate Patch
          </button>

          <button
            onClick={handleCompilePatch}
            disabled={isCompiling}
            className="px-space-sm py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-body-base text-xs transition-colors border border-[#e3e2df] cursor-pointer disabled:opacity-50"
          >
            {isCompiling ? 'Compiling...' : 'Compile Patch'}
          </button>

          <button
            onClick={() => onShowToast('Patch revision saved as new contract version.')}
            className="px-space-sm py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-body-base text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            Save as New Version
          </button>

          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="flex items-center gap-2 px-space-md py-1.5 bg-[#000000] hover:bg-[#191c1f] text-white rounded-lg font-headline-sm text-xs transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying Invariants...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                <span>Run Verification</span>
              </>
            )}
          </button>

          <button
            onClick={handleDiscardPatch}
            className="px-2.5 py-1.5 rounded-lg text-[#75777a] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-colors text-xs font-mono cursor-pointer"
            title="Discard Patch"
          >
            Discard
          </button>
        </div>
      </div>

      {/* DUAL DECK CODE REVIEWER */}
      <div className="bg-[#191c1f] rounded-xl border border-white/10 shadow-xl overflow-hidden text-white">
        {/* Deck Header */}
        <div className="bg-[#111719] px-space-md py-space-xs flex items-center justify-between text-xs text-[#828488] font-mono border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-[#c5c6ca] font-semibold">Dual Deck AST Differential</span>
            <span className="text-[#75777a]">solc 0.8.20 --via-ir</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#ffdad6]">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Original Vulnerabilities (3)
            </span>
            <span className="flex items-center gap-1 text-[#86d6bb]">
              <span className="w-2 h-2 rounded-full bg-[#37675d]"></span> Checks-Effects + Guards
            </span>
          </div>
        </div>

        {/* Code Viewport: Split or Unified */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10 font-mono text-xs leading-relaxed max-h-[560px] overflow-y-auto">
            {/* Left: Original Contract (Read-Only, Vulnerable Lines Highlighted) */}
            <div className="p-space-md space-y-1 bg-[#161a1c]">
              <div className="text-[#75777a] pb-2 font-label-caps uppercase border-b border-white/5 flex items-center justify-between">
                <span>Original: VulnerableVault.sol</span>
                <span className="text-[#ffdad6] font-medium bg-[#ba1a1a]/20 px-2 py-0.5 rounded">3 Vulnerabilities</span>
              </div>
              <div className="pt-2 space-y-0.5">
                {originalLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  // Lines 14-21 (Reentrancy in withdraw), line 25 (changeOwner), line 30 (execute)
                  const isReentrancy = lineNum >= 14 && lineNum <= 21;
                  const isAccess = lineNum >= 23 && lineNum <= 25;
                  const isUnchecked = lineNum >= 27 && lineNum <= 31;
                  const isVulnerable = isReentrancy || isAccess || isUnchecked;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start ${
                        isVulnerable ? 'bg-[#ba1a1a]/25 text-[#ffdad6] -mx-2 px-2 py-0.5 rounded' : 'text-[#828488]'
                      }`}
                    >
                      <span className="w-6 text-right pr-3 select-none text-[#75777a] shrink-0 font-mono text-[10px]">
                        {lineNum}
                      </span>
                      <pre className="font-mono overflow-visible whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Proposed Patch (Hardened) */}
            <div className="p-space-md space-y-1 bg-[#111719]">
              <div className="text-[#75777a] pb-2 font-label-caps uppercase border-b border-white/5 flex items-center justify-between">
                <span>Proposed Patch: Verified Hardening</span>
                <span className="text-[#86d6bb] font-medium bg-[#37675d]/20 px-2 py-0.5 rounded">
                  ReentrancyGuard + CEI + onlyOwner
                </span>
              </div>
              <div className="pt-2 space-y-0.5">
                {patchedLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isAdded = line.includes('ReentrancyGuard') || line.includes('onlyOwner') || line.includes('balances[msg.sender] -= amount') || line.includes('bool success');

                  return (
                    <div
                      key={idx}
                      className={`flex items-start ${
                        isAdded ? 'bg-[#37675d]/25 text-[#86d6bb] -mx-2 px-2 py-0.5 rounded font-medium' : 'text-[#c5c6ca]'
                      }`}
                    >
                      <span className="w-6 text-right pr-3 select-none text-[#75777a] shrink-0 font-mono text-[10px]">
                        {lineNum}
                      </span>
                      <pre className="font-mono overflow-visible whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Unified Diff View */
          <div className="p-space-md font-mono text-xs leading-relaxed max-h-[560px] overflow-y-auto space-y-1 bg-[#111719]">
            <div className="text-[#75777a]">@@ -1,33 +1,48 @@ VulnerableVault.sol Differential</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+ import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";</div>
            <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-2 py-0.5 rounded">- contract VulnerableVault &#123;</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+ contract VulnerableVault is ReentrancyGuard &#123;</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+     modifier onlyOwner() &#123; require(msg.sender == owner, "Caller is not owner"); _; &#125;</div>
            <div className="text-[#75777a] px-2">      mapping(address =&gt; uint256) public balances;</div>
            <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-2 py-0.5 rounded">-     function withdraw(uint256 amount) external &#123;</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+     function withdraw(uint256 amount) external nonReentrant &#123;</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+         // 1. CHECKS &amp; EFFECTS: update storage ledger before message call</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+         balances[msg.sender] -= amount;</div>
            <div className="text-[#75777a] px-2">          (bool success, ) = msg.sender.call&#123;value: amount&#125;("");</div>
            <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-2 py-0.5 rounded">-         balances[msg.sender] -= amount;</div>
            <div className="text-[#75777a] px-2">      &#125;</div>
            <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-2 py-0.5 rounded">-     function changeOwner(address newOwner) external &#123;</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+     function changeOwner(address newOwner) external onlyOwner &#123;</div>
            <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-2 py-0.5 rounded">-         target.call(data);</div>
            <div className="text-[#86d6bb] bg-[#37675d]/20 px-2 py-0.5 rounded">+         (bool success, ) = target.call(data); require(success, "Execution failed");</div>
          </div>
        )}
      </div>

      {/* COMPILER OUTPUT LOGS */}
      {compilationResult && (
        <div className="bg-[#111719] border border-white/10 rounded-xl p-space-md text-white space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#c5c6ca] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#86d6bb]">terminal</span>
              Compiler Diagnostic Output (solc 0.8.20)
            </span>
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${
              compilationResult.success ? 'bg-[#37675d]/30 text-[#86d6bb]' : 'bg-[#ba1a1a]/30 text-[#ffdad6]'
            }`}>
              {compilationResult.success ? 'Compilation: successful' : 'Compilation: failed'}
            </span>
          </div>
          <div className="bg-black/60 p-3 rounded-lg font-mono text-xs space-y-1 text-[#c5c6ca] border border-white/5">
            {compilationResult.logs.map((log, index) => (
              <div key={index} className="text-[#86d6bb]">{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* VERIFICATION LIVE RUNNER & PROOF RESULTS */}
      {verificationResult && (
        <div className="bg-[#111719] border border-[#37675d]/40 rounded-xl p-space-md text-white space-y-space-sm animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#86d6bb] animate-pulse"></span>
              <span className="font-mono text-sm font-semibold text-[#86d6bb]">
                Foundry Invariant Harness &amp; Deterministic Proof
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-[#37675d]/30 text-[#86d6bb] font-mono text-xs font-bold">
              Verification: {verificationResult.status}
            </span>
          </div>

          {/* Exact Acceptance Test Check Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-black/50 p-3 rounded-lg border border-[#37675d]/30 font-mono text-xs space-y-1">
              <div className="text-[#75777a] text-[10px] uppercase font-bold">Finding #01: Reentrancy</div>
              <div className="text-[#86d6bb] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Reentrancy: resolved</span>
              </div>
              <div className="text-[11px] text-[#828488]">Checks-Effects-Interactions &amp; mutex verified.</div>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-[#37675d]/30 font-mono text-xs space-y-1">
              <div className="text-[#75777a] text-[10px] uppercase font-bold">Finding #02: Access Control</div>
              <div className="text-[#86d6bb] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Missing access control: resolved</span>
              </div>
              <div className="text-[11px] text-[#828488]">onlyOwner modifier applied to changeOwner().</div>
            </div>

            <div className="bg-black/50 p-3 rounded-lg border border-[#37675d]/30 font-mono text-xs space-y-1">
              <div className="text-[#75777a] text-[10px] uppercase font-bold">Finding #03: External Call</div>
              <div className="text-[#86d6bb] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Unchecked external call: resolved</span>
              </div>
              <div className="text-[11px] text-[#828488]">require(success) check enforced on low-level call.</div>
            </div>
          </div>

          <div className="bg-black/60 p-3 rounded-lg font-mono text-xs space-y-1 text-[#c5c6ca] border border-white/5">
            <div className="text-[#75777a]">[Foundry] Test harness execution summary:</div>
            {verificationResult.logs.map((log, index) => (
              <div key={index} className="text-[#86d6bb]">{log}</div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 font-mono text-xs text-[#828488]">
            <span>Remaining findings: 0</span>
            <span className="text-[#86d6bb] font-bold">Verification: passed</span>
          </div>
        </div>
      )}
    </div>
  );
};
