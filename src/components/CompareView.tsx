import React from 'react';
import type { AppScreen } from '../types';

interface CompareViewProps {
  onNavigate: (screen: AppScreen) => void;
  onShowToast: (msg: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ onNavigate, onShowToast }) => {
  return (
    <div className="p-space-lg max-w-[1400px] mx-auto space-y-space-md animate-fadeIn">
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#37675d]">compare_arrows</span>
            <span className="font-label-caps text-xs text-[#37675d] uppercase font-semibold">
              Differential Audit Compare
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">
            Compare Security Reports &amp; Invariants
          </h1>
          <p className="font-body-base text-body-base text-[#44474a]">
            Side-by-side evaluation of vulnerability reductions, gas delta differentials, and AST modifications across contract revisions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onShowToast('Exported differential comparison markdown summary.')}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-mono text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Comparison</span>
          </button>
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#191c1f] hover:bg-[#000000] text-white font-mono text-xs transition-colors cursor-pointer"
          >
            <span>Return to Overview</span>
          </button>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Revision A: Unpatched */}
        <div className="bg-[#ffffff] rounded-xl border border-[#ba1a1a]/30 p-space-lg shadow-xs space-y-space-md">
          <div className="flex items-center justify-between border-b border-[#e9e8e5] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
                BASELINE REVISION
              </span>
              <h2 className="font-headline-sm text-sm font-semibold text-[#1b1c1a] mt-1">
                VulnerableVault.sol (Unpatched)
              </h2>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-[#ba1a1a]">42</span>
              <span className="text-xs text-[#75777a]">/100</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">Critical Findings</span>
              <span className="text-[#ba1a1a] font-bold">1 (Reentrancy)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">High Findings</span>
              <span className="text-[#e06d53] font-bold">1 (Missing access control)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">Medium Findings</span>
              <span className="text-[#c28400] font-bold">1 (Unchecked call return)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">Verification State</span>
              <span className="text-[#ba1a1a] font-bold">Failed / Vulnerable</span>
            </div>
          </div>
        </div>

        {/* Revision B: Patched */}
        <div className="bg-[#ffffff] rounded-xl border border-[#37675d]/30 p-space-lg shadow-xs space-y-space-md">
          <div className="flex items-center justify-between border-b border-[#e9e8e5] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#1e4f46] bg-[#baede0] px-2 py-0.5 rounded">
                PATCHED REVISION
              </span>
              <h2 className="font-headline-sm text-sm font-semibold text-[#1b1c1a] mt-1">
                VulnerableVault.sol (Hardened Revision #02)
              </h2>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-bold text-[#37675d]">98</span>
              <span className="text-xs text-[#75777a]">/100</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">Critical Findings</span>
              <span className="text-[#37675d] font-bold">0 (Resolved)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">High Findings</span>
              <span className="text-[#37675d] font-bold">0 (Resolved)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">Medium Findings</span>
              <span className="text-[#37675d] font-bold">0 (Resolved)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#faf9f6]">
              <span className="text-[#75777a]">Verification State</span>
              <span className="text-[#37675d] font-bold">Passed (0 broken invariants)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
