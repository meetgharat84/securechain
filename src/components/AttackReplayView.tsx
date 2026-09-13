import React, { useState } from 'react';
import type { AppScreen } from '../types';
import { TELEMETRY_BLOCK_URL, REPLAY_STEPS } from '../data/mockData';

interface AttackReplayViewProps {
  onNavigate: (screen: AppScreen) => void;
  onShowToast: (msg: string) => void;
}

export const AttackReplayView: React.FC<AttackReplayViewProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [activeStep, setActiveStep] = useState<number>(4);
  const [fuzzRuns] = useState<number>(10000);

  return (
    <div className="p-space-lg max-w-[1600px] mx-auto space-y-space-md">
      {/* Top Header & Telemetry Actions */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap font-code-sm text-code-sm text-[#75777a]">
            <span>Verification Suite</span>
            <span>/</span>
            <span className="text-[#1b1c1a] font-medium">Run ID: vrun_09</span>
            <span>/</span>
            <span className="font-mono">Commit: 7a9e14c</span>
            <span className="px-2 py-0.5 rounded-full bg-[#baede0]/40 text-[#1e4f46] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]"></span>
              VERIFIED: Configured Checks Passed
            </span>
          </div>

          <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">
            Verification &amp; Attack Replay: Patch #01 for TreasuryVault.sol
          </h1>
          <p className="font-body-base text-body-base text-[#44474a]">
            Deterministic bytecode execution comparing adversarial reentrancy vectors before and after remediation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onShowToast('Exported cryptographic telemetry proof (vrun_09.proof.json)')}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-body-base text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>Export Telemetry Proof</span>
          </button>
          <button
            onClick={() => onNavigate('patch-review')}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#191c1f] hover:bg-[#000000] text-white font-body-base text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">code</span>
            <span>Return to Workbench</span>
          </button>
        </div>
      </div>

      {/* Hero Replay Simulation Synopsis Card */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg shadow-xs space-y-space-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Left Text & Metrics */}
          <div className="lg:col-span-8 space-y-space-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#37675d]">
                <span className="material-symbols-outlined text-base">memory</span>
                <span className="font-semibold uppercase tracking-wider">Deterministic EVM Replay Engine</span>
                <span className="text-[#75777a]">(Anvil Fork 19284201)</span>
              </div>
              <p className="font-body-base text-body-base text-[#44474a] leading-relaxed">
                Automated regression replay executing <code className="font-mono text-xs bg-[#efeeeb] px-1 py-0.5 rounded text-[#1b1c1a]">SWC-107 Reentrancy</code> vector against both canonical bytecode targets. The state mutator observed total protection under exact historic calldata sequences with zero capital leakage.
              </p>
            </div>

            {/* Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="bg-[#f4f3f0] p-space-sm rounded-lg border border-[#e9e8e5]">
                <span className="font-label-caps text-[10px] text-[#75777a] uppercase tracking-wider">EVM Spec</span>
                <div className="font-headline-sm text-sm font-bold text-[#1b1c1a] mt-0.5">Cancun / solc 0.8.20</div>
              </div>
              <div className="bg-[#f4f3f0] p-space-sm rounded-lg border border-[#e9e8e5]">
                <span className="font-label-caps text-[10px] text-[#75777a] uppercase tracking-wider">Replay Iterations</span>
                <div className="font-headline-sm text-sm font-bold text-[#1b1c1a] mt-0.5">{fuzzRuns.toLocaleString()} Fuzz Runs</div>
              </div>
              <div className="bg-[#baede0]/30 p-space-sm rounded-lg border border-[#37675d]/20">
                <span className="font-label-caps text-[10px] text-[#37675d] uppercase tracking-wider">Residual Capital Risk</span>
                <div className="font-headline-sm text-sm font-bold text-[#1e4f46] mt-0.5">$0.00 / 0.00 ETH</div>
              </div>
              <div className="bg-[#baede0]/30 p-space-sm rounded-lg border border-[#37675d]/20">
                <span className="font-label-caps text-[10px] text-[#37675d] uppercase tracking-wider">Equivalence Proof</span>
                <div className="font-headline-sm text-sm font-bold text-[#1e4f46] mt-0.5">Formally Verified</div>
              </div>
            </div>
          </div>

          {/* Right State Vector Delta Card */}
          <div className="lg:col-span-4 bg-[#f4f3f0] rounded-xl border border-[#e9e8e5] p-space-md flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-36 h-36 relative flex items-center justify-center">
              <img
                alt="Dual interlocking 3D block geometry representing verified state vector delta"
                className="w-full h-full object-contain mix-blend-multiply opacity-90"
                src={TELEMETRY_BLOCK_URL}
              />
            </div>
            <div className="space-y-0.5">
              <div className="font-mono text-xs text-[#1b1c1a] font-semibold">
                Replay Seed: 0x9bf4...291a <span className="text-[#37675d]">[Passed]</span>
              </div>
              <div className="font-label-caps text-[10px] text-[#75777a] uppercase tracking-wider">
                Formal Assertion Match: 100.0% Confidence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORENSIC DISASSEMBLY & EXECUTION SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Left: Original Contract (Unpatched - Exploit Succeeded) */}
        <div className="bg-[#ffffff] rounded-xl border border-[#ba1a1a]/30 p-space-md space-y-space-md shadow-xs flex flex-col justify-between">
          <div className="space-y-space-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-[#e9e8e5]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
                <span className="font-headline-sm text-sm font-bold text-[#ba1a1a]">
                  Original Contract (Unpatched)
                </span>
              </div>
              <span className="font-mono text-xs text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded font-semibold">
                Score: 42 / 100
              </span>
            </div>

            {/* Exploit Replay Terminal */}
            <div className="bg-[#191c1f] rounded-lg p-space-sm font-mono text-xs text-white space-y-1 border border-white/10">
              <div className="text-[#828488] border-b border-white/10 pb-1 flex justify-between">
                <span>Attack Replay Execution Log</span>
                <span className="text-[#ffdad6]">TX REVERTED: FALSE</span>
              </div>
              <div className="text-[#c5c6ca]">[01] INJECT_ATTACK_CONTRACT -&gt; 0x81ba...ea02</div>
              <div className="text-[#c5c6ca]">[02] CALL withdrawFunds(5 ETH) [gas: 42,109]</div>
              <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-1 py-0.5 rounded">
                [03] REENTRANCY_TRIGGERED -&gt; fallback() recurses 4x
              </div>
              <div className="text-[#ffdad6] bg-[#ba1a1a]/20 px-1 py-0.5 rounded">
                [04] DRAIN_EXECUTED -&gt; vault balance depleted
              </div>
              <div className="text-[#ba1a1a] font-bold pt-1 border-t border-white/10">
                DRAINED RESULT: -14.50 ETH / $48,290.00 USD
              </div>
            </div>

            {/* Vulnerable Code Excerpt */}
            <div className="bg-[#f4f3f0] p-space-sm rounded-lg font-mono text-xs space-y-0.5 border border-[#e9e8e5]">
              <div className="text-[#75777a] pb-1 font-label-caps uppercase">Vulnerable Pattern</div>
              <div className="text-[#44474a]">18: (bool success, ) = msg.sender.call&#123;value: amount&#125;("");</div>
              <div className="text-[#ba1a1a] font-semibold">19: balances[msg.sender] -= amount; // Too late</div>
            </div>
          </div>

          <div className="pt-space-xs text-xs font-mono text-[#ba1a1a] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">error</span>
            <span>Exploit succeeded. Invariant #01 violated.</span>
          </div>
        </div>

        {/* Right: Patched Contract (Verified Safe - Exploit Blocked) */}
        <div className="bg-[#ffffff] rounded-xl border border-[#37675d]/40 p-space-md space-y-space-md shadow-xs flex flex-col justify-between">
          <div className="space-y-space-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-[#e9e8e5]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#37675d]"></span>
                <span className="font-headline-sm text-sm font-bold text-[#37675d]">
                  Patched Contract (Verified Safe)
                </span>
              </div>
              <span className="font-mono text-xs text-[#1e4f46] bg-[#baede0] px-2 py-0.5 rounded font-semibold">
                Score: 94 / 100 (+52 pts)
              </span>
            </div>

            {/* Exploit Replay Terminal */}
            <div className="bg-[#111719] rounded-lg p-space-sm font-mono text-xs text-white space-y-1 border border-white/10">
              <div className="text-[#828488] border-b border-white/10 pb-1 flex justify-between">
                <span>Attack Replay Execution Log</span>
                <span className="text-[#86d6bb]">EXPLOIT VECTOR NEUTRALIZED</span>
              </div>
              <div className="text-[#c5c6ca]">[01] INJECT_ATTACK_CONTRACT -&gt; 0x81ba...ea02</div>
              <div className="text-[#c5c6ca]">[02] CALL withdrawFunds(5 ETH) [nonReentrant lock set]</div>
              <div className="text-[#86d6bb] bg-[#37675d]/20 px-1 py-0.5 rounded">
                [03] EFFECT_APPLIED -&gt; balances[attacker] zeroed
              </div>
              <div className="text-[#86d6bb] bg-[#37675d]/20 px-1 py-0.5 rounded">
                [04] REENTRANCY_ATTEMPT -&gt; EVMSignal: Revert with 'ReentrancyGuard: reentrant call'
              </div>
              <div className="text-[#86d6bb] font-bold pt-1 border-t border-white/10">
                DRAINED RESULT: 0.00 ETH / $0.00 LOST
              </div>
            </div>

            {/* Hardened Code Excerpt */}
            <div className="bg-[#baede0]/15 p-space-sm rounded-lg font-mono text-xs space-y-0.5 border border-[#37675d]/20">
              <div className="text-[#37675d] pb-1 font-label-caps uppercase font-semibold">Verified Defense</div>
              <div className="text-[#1e4f46] font-semibold">18: balances[msg.sender] -= amount; // Effect First</div>
              <div className="text-[#44474a]">19: (bool success, ) = msg.sender.call&#123;value: amount&#125;("");</div>
            </div>
          </div>

          <div className="pt-space-xs text-xs font-mono text-[#37675d] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">task_alt</span>
            <span>All state mutations bound within invariant bounds.</span>
          </div>
        </div>
      </div>

      {/* 5-STEP REPLAY EXECUTION MATRIX */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-md shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
              Sequential Execution Trace Matrix
            </h3>
            <p className="font-body-sm text-xs text-[#75777a]">
              Click any chronological execution step to inspect EVM storage registers and opcode telemetry.
            </p>
          </div>
          <span className="font-mono text-xs text-[#37675d] font-medium">5/5 Steps Traced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-space-xs">
          {REPLAY_STEPS.map((s) => {
            const isSelected = activeStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-space-sm rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#37675d] bg-[#baede0]/20 ring-1 ring-[#37675d]'
                    : 'border-[#e9e8e5] bg-[#f4f3f0] hover:bg-[#efeeeb]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#75777a]">
                  <span>STEP 0{s.step}</span>
                  <span
                    className={`font-semibold ${
                      s.status === 'revert' ? 'text-[#37675d]' : s.status === 'passed' ? 'text-[#37675d]' : 'text-[#44474a]'
                    }`}
                  >
                    {s.gas}
                  </span>
                </div>
                <div className="font-headline-sm text-xs font-semibold text-[#1b1c1a] mt-1 leading-snug">
                  {s.title}
                </div>
                <div className="font-body-sm text-[11px] text-[#44474a] mt-1 line-clamp-2">
                  {s.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REGRESSION TEST BENCH & GAS PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Regression Bench */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-sm shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs text-[#37675d] uppercase font-bold tracking-wider">
              Regression Test Bench
            </span>
            <span className="font-mono text-xs text-[#37675d] font-bold">12 / 12 Passed</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-[#f4f3f0]">
              <span className="text-[#44474a]">Deposit Monotonicity</span>
              <span className="text-[#37675d] font-bold">PASS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f4f3f0]">
              <span className="text-[#44474a]">Unauthorized Drain Guard</span>
              <span className="text-[#37675d] font-bold">PASS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f4f3f0]">
              <span className="text-[#44474a]">Gas Consumption Limit</span>
              <span className="text-[#37675d] font-bold">PASS</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#44474a]">Solvency Invariant Sum</span>
              <span className="text-[#37675d] font-bold">PASS</span>
            </div>
          </div>
        </div>

        {/* Gas Delta Profile */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-sm shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs text-[#1b1c1a] uppercase font-bold tracking-wider">
              Gas Delta Profile
            </span>
            <span className="font-mono text-xs text-[#44474a]">+1.8% (+2,120 gas)</span>
          </div>

          <div className="h-16 flex items-end gap-1.5 pt-2">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#75777a] h-10 rounded-t"></div>
              <span className="font-mono text-[10px] text-[#75777a]">Baseline</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#37675d] h-11 rounded-t"></div>
              <span className="font-mono text-[10px] text-[#37675d] font-semibold">Patched</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#75777a] pt-1 flex justify-between">
            <span>Optimizer: enabled (runs=200)</span>
            <span className="text-[#37675d] font-medium">Yul Pass OK</span>
          </div>
        </div>

        {/* Audit Advisory Notice */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-xs shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-label-caps text-xs text-[#75777a] uppercase font-bold tracking-wider">
              Audit Advisory Notice
            </span>
            <p className="font-body-sm text-xs text-[#44474a] leading-relaxed">
              Formal verification proves the targeted invariant holds across all symbolic execution traces. Human peer-review remains advised prior to mainnet deployment.
            </p>
          </div>
          <button
            onClick={() => onShowToast('Telemetry proof exported to /reports/REP-84102-SEC.pdf')}
            className="w-full py-1.5 rounded-lg bg-[#000000] text-white font-mono text-xs hover:bg-[#191c1f] transition-all cursor-pointer"
          >
            Download Signed Telemetry PDF
          </button>
        </div>
      </div>
    </div>
  );
};
