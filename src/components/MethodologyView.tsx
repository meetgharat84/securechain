import React from 'react';
import type { AppScreen } from '../types';

interface MethodologyViewProps {
  onNavigate: (screen: AppScreen) => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-space-lg max-w-[1200px] mx-auto space-y-space-xl">
      {/* Editorial Header */}
      <div className="space-y-space-xs border-b border-[#e9e8e5] pb-space-lg">
        <div className="flex items-center gap-2 font-label-caps text-xs text-[#37675d] uppercase tracking-widest font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#37675d]"></span>
          <span>Formal Verification Architecture</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-[#1b1c1a] tracking-tight">
          Deterministic AST Verification &amp; Patching Protocol
        </h1>
        <p className="font-body-lg text-body-lg text-[#44474a] max-w-3xl leading-relaxed">
          How SecureChain AI combines AST control-flow synthesis, SMT symbolic execution, and automated Foundry harness generation to ensure verified patch safety.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-sm shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-[#baede0]/40 flex items-center justify-center text-[#37675d]">
            <span className="material-symbols-outlined text-xl">account_tree</span>
          </div>
          <h3 className="font-headline-sm text-base font-semibold text-[#1b1c1a]">AST Control Flow Traversal</h3>
          <p className="font-body-sm text-xs text-[#44474a] leading-relaxed">
            Parses Solidity Abstract Syntax Trees into structured call graphs. Detects execution path anomalies where external message forwarding precedes internal state mutations.
          </p>
        </div>

        <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-sm shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-[#baede0]/40 flex items-center justify-center text-[#37675d]">
            <span className="material-symbols-outlined text-xl">verified</span>
          </div>
          <h3 className="font-headline-sm text-base font-semibold text-[#1b1c1a]">SMT Solver Invariance</h3>
          <p className="font-body-sm text-xs text-[#44474a] leading-relaxed">
            Applies Z3 and Eldarica constraint solvers to prove protocol solvency assertions hold across all possible unbounded user inputs and reentrancy execution branches.
          </p>
        </div>

        <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md space-y-space-sm shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-[#baede0]/40 flex items-center justify-center text-[#37675d]">
            <span className="material-symbols-outlined text-xl">terminal</span>
          </div>
          <h3 className="font-headline-sm text-base font-semibold text-[#1b1c1a]">Foundry Fuzz Harness Synthesis</h3>
          <p className="font-body-sm text-xs text-[#44474a] leading-relaxed">
            Automatically generates executable Solidity test suites targeting identified CVE paths. Asserts test failure on the unpatched bytecode and success on the verified patch.
          </p>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg space-y-space-md shadow-xs">
        <h2 className="font-headline-sm text-lg font-semibold text-[#1b1c1a]">
          The 4-Step Verification Cycle
        </h2>

        <div className="space-y-space-md border-l-2 border-[#37675d] pl-space-md ml-2 font-body-base text-sm">
          <div className="space-y-1">
            <div className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
              1. AST Control-Flow Decomposition
            </div>
            <p className="text-[#44474a]">
              Static evaluation traverses every function selector, mapping storage dependencies and external call sites to construct state mutation order graphs.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
              2. Symbolic Exploit Reconstruction
            </div>
            <p className="text-[#44474a]">
              Constructs minimal adversarial contracts capable of triggering identified vectors in a sandboxed Anvil execution fork.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
              3. Non-Breaking Patch Synthesis
            </div>
            <p className="text-[#44474a]">
              Generates minimal AST mutations that re-order statements into Checks-Effects-Interactions order while preserving external function signatures and gas economics.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
              4. Regression &amp; Invariant Bound Confirmation
            </div>
            <p className="text-[#44474a]">
              Executes 10,000+ fuzzing cycles to verify that existing protocol functionality remains 100% operational with no unintended side-effects.
            </p>
          </div>
        </div>

        <div className="pt-space-md border-t border-[#e9e8e5] flex justify-end">
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2 px-space-md py-2 bg-[#000000] text-white rounded-lg text-xs font-semibold font-mono hover:bg-[#191c1f] transition-all cursor-pointer"
          >
            <span>Launch Audit Workbench &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
