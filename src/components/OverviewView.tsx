import React, { useState } from 'react';
import type { AppScreen, Finding } from '../types';
import { INITIAL_FINDINGS, TREASURY_VAULT_SOURCE } from '../data/mockData';

interface OverviewViewProps {
  onNavigate: (screen: AppScreen) => void;
  selectedFindingId: string;
  onSelectFinding: (findingId: string) => void;
  onOpenNewScan: () => void;
  activeTarget: string;
  onShowToast: (msg: string) => void;
  customFindings?: Finding[];
  customSourceCode?: string;
  contractName?: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  selectedFindingId,
  onSelectFinding,
  onOpenNewScan,
  activeTarget,
  onShowToast,
  customFindings,
  customSourceCode,
  contractName = 'VulnerableVault.sol'
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const findings = customFindings && customFindings.length > 0 ? customFindings : INITIAL_FINDINGS;
  const source = customSourceCode || TREASURY_VAULT_SOURCE;

  const currentFinding = findings.find((f) => f.id === selectedFindingId) || findings[0] || INITIAL_FINDINGS[0];

  const filteredFindings = findings.filter((f) => {
    if (severityFilter === 'all') return true;
    return f.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const sourceLines = source.split('\n');

  const criticalCount = findings.filter(f => f.severity === 'Critical').length;
  const highCount = findings.filter(f => f.severity === 'High').length;
  const mediumCount = findings.filter(f => f.severity === 'Medium').length;
  const lowCount = findings.filter(f => f.severity === 'Low').length;

  return (
    <div className="p-space-lg max-w-[1600px] mx-auto space-y-space-md animate-fadeIn">
      {/* Top Contract Meta Bar */}
      <div className="bg-[#ffffff] p-space-md rounded-xl border border-[#e9e8e5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-lg bg-[#efeeeb] flex items-center justify-center text-[#1b1c1a] border border-[#e3e2df]">
            <span className="material-symbols-outlined text-2xl text-[#37675d]">code_blocks</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">{contractName}</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#efeeeb] font-code-sm text-code-sm text-[#44474a]">
                {activeTarget}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#efeeeb] font-code-sm text-code-sm text-[#44474a]">
                Solidity 0.8.20
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#baede0]/40 font-code-sm text-code-sm text-[#1e4f46] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]"></span>
                Automated Verification
              </span>
            </div>
            <div className="flex items-center gap-space-md font-code-sm text-code-sm text-[#75777a] mt-0.5">
              <span>Scanned 2 minutes ago</span>
              <span>•</span>
              <span>solc 0.8.20 · slither 0.10.1 · ast-mutator 3.4.1</span>
              <span>•</span>
              <span className="text-[#37675d] font-semibold">Report ID: REP-84102-SEC</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => onShowToast('Exporting cryptographic JSON & Markdown audit report (REP-84102-SEC)...')}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-body-base text-body-base transition-colors border border-[#e3e2df] cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Report</span>
          </button>
          <button
            onClick={onOpenNewScan}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#191c1f] hover:bg-[#000000] text-[#ffffff] font-body-base text-body-base transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Re-run Analysis</span>
          </button>
        </div>
      </div>

      {/* Security Score Banner */}
      <div className="bg-[#ffffff] p-space-md rounded-xl border border-[#ba1a1a]/20 bg-gradient-to-r from-[#ffdad6]/20 via-[#ffffff] to-[#ffffff] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-baseline gap-1">
            <span className="font-headline-lg text-[44px] leading-none font-bold text-[#ba1a1a]">42</span>
            <span className="font-code-sm text-base text-[#75777a]">/ 100</span>
          </div>
          <div className="h-10 w-px bg-[#e9e8e5]"></div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm text-[#ba1a1a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl">gpp_bad</span>
                High Risk Detected
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-label-caps text-[11px] font-bold uppercase tracking-wider">
                {findings.length} vulnerabilities found
              </span>
            </div>
            <p className="font-body-base text-body-base text-[#44474a]">
              Reentrancy in <code className="text-[#1b1c1a] font-mono bg-[#efeeeb] px-1 py-0.5 rounded text-xs">withdraw()</code> allows total protocol drainage. AI-assisted patch synthesis available below.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('patch-review')}
          className="flex items-center gap-2 px-space-lg py-space-xs bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg font-headline-sm text-body-base shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <span>Review Patch in Workbench</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Metric Strip (Filterable) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-xs">
        <button
          onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
          className={`p-space-sm rounded-lg border text-left transition-all cursor-pointer ${
            severityFilter === 'critical' ? 'border-[#ba1a1a] bg-[#ffdad6]/30 ring-1 ring-[#ba1a1a]' : 'border-[#e9e8e5] bg-[#ffffff] hover:bg-[#f4f3f0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-[#ba1a1a] font-bold">Critical</span>
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
          </div>
          <div className="font-headline-md text-2xl font-bold text-[#1b1c1a] mt-1">{criticalCount}</div>
          <div className="font-code-sm text-[11px] text-[#75777a]">Reentrancy external call</div>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'high' ? 'all' : 'high')}
          className={`p-space-sm rounded-lg border text-left transition-all cursor-pointer ${
            severityFilter === 'high' ? 'border-[#e06d53] bg-[#ffdad6]/20 ring-1 ring-[#e06d53]' : 'border-[#e9e8e5] bg-[#ffffff] hover:bg-[#f4f3f0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-[#e06d53] font-bold">High</span>
            <span className="w-2 h-2 rounded-full bg-[#e06d53]"></span>
          </div>
          <div className="font-headline-md text-2xl font-bold text-[#1b1c1a] mt-1">{highCount}</div>
          <div className="font-code-sm text-[11px] text-[#75777a]">Missing access control</div>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'medium' ? 'all' : 'medium')}
          className={`p-space-sm rounded-lg border text-left transition-all cursor-pointer ${
            severityFilter === 'medium' ? 'border-[#c28400] bg-[#fff8e1] ring-1 ring-[#c28400]' : 'border-[#e9e8e5] bg-[#ffffff] hover:bg-[#f4f3f0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-[#8c6000] font-bold">Medium</span>
            <span className="w-2 h-2 rounded-full bg-[#c28400]"></span>
          </div>
          <div className="font-headline-md text-2xl font-bold text-[#1b1c1a] mt-1">{mediumCount}</div>
          <div className="font-code-sm text-[11px] text-[#75777a]">Unchecked call return</div>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'low' ? 'all' : 'low')}
          className={`p-space-sm rounded-lg border text-left transition-all cursor-pointer ${
            severityFilter === 'low' ? 'border-[#37675d] bg-[#baede0]/20 ring-1 ring-[#37675d]' : 'border-[#e9e8e5] bg-[#ffffff] hover:bg-[#f4f3f0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-[#75777a] font-bold">Low</span>
            <span className="w-2 h-2 rounded-full bg-[#75777a]"></span>
          </div>
          <div className="font-headline-md text-2xl font-bold text-[#1b1c1a] mt-1">{lowCount}</div>
          <div className="font-code-sm text-[11px] text-[#75777a]">Informational syntax</div>
        </button>

        <button
          onClick={() => setSeverityFilter('all')}
          className={`p-space-sm rounded-lg border text-left transition-all cursor-pointer ${
            severityFilter === 'all' ? 'border-[#37675d] bg-[#baede0]/20 ring-1 ring-[#37675d]' : 'border-[#e9e8e5] bg-[#ffffff] hover:bg-[#f4f3f0]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-[#37675d] font-bold">Filter</span>
            <span className="material-symbols-outlined text-sm text-[#37675d]">tune</span>
          </div>
          <div className="font-headline-md text-2xl font-bold text-[#37675d] mt-1">All ({findings.length})</div>
          <div className="font-code-sm text-[11px] text-[#3e6d63]">Show all vectors</div>
        </button>
      </div>

      {/* 3-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* COLUMN 1: Findings Rail */}
        <div className="lg:col-span-3 bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-sm space-y-space-xs shadow-xs">
          <div className="flex items-center justify-between px-space-xs py-space-2xs border-b border-[#e9e8e5]">
            <span className="font-label-caps text-label-caps text-[#75777a] uppercase tracking-wider">
              Findings ({filteredFindings.length})
            </span>
            <span className="font-code-sm text-code-sm text-[#37675d] font-semibold">AST-Ranked</span>
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredFindings.map((finding) => {
              const isSelected = finding.id === currentFinding.id;
              const severityColor =
                finding.severity === 'Critical'
                  ? 'border-l-4 border-l-[#ba1a1a] bg-[#ffdad6]/15'
                  : finding.severity === 'High'
                  ? 'border-l-4 border-l-[#e06d53] bg-[#ffdad6]/10'
                  : finding.severity === 'Medium'
                  ? 'border-l-4 border-l-[#c28400] bg-[#fff8e1]/30'
                  : 'border-l-4 border-l-[#75777a] bg-[#efeeeb]/30';

              return (
                <div
                  key={finding.id}
                  onClick={() => onSelectFinding(finding.id)}
                  className={`p-space-sm rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#000000] shadow-sm ring-1 ring-[#000000] bg-[#ffffff]'
                      : 'border-[#e9e8e5] hover:bg-[#f4f3f0]'
                  } ${severityColor}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded font-label-caps text-[9px] font-bold uppercase tracking-wider ${
                        finding.severity === 'Critical'
                          ? 'bg-[#ba1a1a] text-white'
                          : finding.severity === 'High'
                          ? 'bg-[#e06d53] text-white'
                          : finding.severity === 'Medium'
                          ? 'bg-[#c28400] text-white'
                          : 'bg-[#75777a] text-white'
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <span className="font-code-sm text-code-sm text-[#75777a] font-mono">{finding.lines}</span>
                  </div>

                  <div className="font-headline-sm text-[13px] font-semibold text-[#1b1c1a] leading-tight">
                    {finding.title}
                  </div>
                  <div className="font-code-sm text-[11px] text-[#44474a] font-mono truncate mt-0.5">
                    {finding.detector}
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-[#e9e8e5] flex items-center justify-between text-[11px] text-[#37675d] font-medium">
                      <span>Inspecting lines</span>
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Center Code Viewport */}
        <div className="lg:col-span-5 bg-[#191c1f] rounded-xl border border-white/10 shadow-lg overflow-hidden flex flex-col">
          {/* Deck Header */}
          <div className="bg-[#111719] px-space-md py-space-xs flex items-center justify-between text-xs text-[#828488] font-mono border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#c5c6ca]">description</span>
              <span className="text-[#e1e2e6] font-medium">{contractName}</span>
              <span className="text-[#75777a]">{currentFinding.lines} highlighted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white/5 text-[#86d6bb] text-[10px] font-mono">
                solc 0.8.20
              </span>
            </div>
          </div>

          {/* Code Viewer with Line Highlights */}
          <div className="p-space-sm font-mono text-xs overflow-x-auto max-h-[640px] overflow-y-auto leading-relaxed select-text">
            {sourceLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isFlagged =
                lineNum >= currentFinding.startLine && lineNum <= currentFinding.endLine;

              return (
                <div
                  key={idx}
                  className={`flex items-start group ${
                    isFlagged ? 'bg-[#ba1a1a]/25 text-[#ffdad6] -mx-2 px-2 py-0.5 rounded' : 'text-[#c5c6ca]'
                  }`}
                >
                  <span
                    className={`w-8 select-none text-right pr-4 shrink-0 ${
                      isFlagged ? 'text-[#ffdad6] font-bold' : 'text-[#75777a] group-hover:text-[#c5c6ca]'
                    }`}
                  >
                    {lineNum}
                  </span>
                  <pre className="font-mono overflow-visible whitespace-pre">{line}</pre>
                </div>
              );
            })}
          </div>

          {/* Highlight Callout Pill at bottom of editor */}
          <div className="bg-[#111719] px-space-md py-space-xs border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#ffdad6]">
              <span className="material-symbols-outlined text-sm text-[#ba1a1a]">warning</span>
              <span>detector: {currentFinding.detector}</span>
            </div>
            <button
              onClick={() => onNavigate('patch-review')}
              className="text-[#86d6bb] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Jump to Proposed Patch</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* COLUMN 3: Evidence & Beginner-Friendly Explanation Panel */}
        <div className="lg:col-span-4 bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg space-y-space-md shadow-xs">
          {/* Header & Badges */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-[#ba1a1a] uppercase font-bold tracking-wider">
                {currentFinding.findingNumber}
              </span>
              <div className="flex items-center gap-1 font-code-sm text-code-sm">
                <span className="px-2 py-0.5 rounded bg-[#efeeeb] text-[#37675d] font-semibold">
                  Confidence: {currentFinding.confidence || 'High'}
                </span>
                <span className="text-[#75777a]">{currentFinding.swcId}</span>
              </div>
            </div>

            <h2 className="font-headline-sm text-headline-sm text-[#1b1c1a]">
              {currentFinding.title} ({currentFinding.functionName || 'Function'})
            </h2>
            <div className="font-code-sm text-xs text-[#75777a]">
              Lines: {currentFinding.lines} · Detector: {currentFinding.detector}
            </div>
          </div>

          {/* Beginner-Friendly Explanation Card */}
          <div className="bg-[#f4f3f0] p-space-sm rounded-lg space-y-2 border border-[#e9e8e5]">
            <div className="flex items-center gap-1.5 text-[#1b1c1a] font-headline-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-sm text-[#37675d]">psychology</span>
              <span>Beginner-Friendly Explanation</span>
            </div>
            <div className="text-xs text-[#44474a] space-y-1.5 leading-relaxed font-sans">
              <div>
                <span className="font-semibold text-[#1b1c1a]">What happened: </span>
                {currentFinding.explanationDetails?.whatHappened || currentFinding.description}
              </div>
              <div>
                <span className="font-semibold text-[#1b1c1a]">Why it matters: </span>
                {currentFinding.explanationDetails?.whyItMatters || 'Bypasses internal invariants and exposes funds to unauthorized drainage.'}
              </div>
              <div>
                <span className="font-semibold text-[#1b1c1a]">What an attacker could do: </span>
                {currentFinding.explanationDetails?.attackerScenario || 'An attacker can hijack control flow and withdraw more funds than deposited.'}
              </div>
              <div>
                <span className="font-semibold text-[#1b1c1a]">How the fix works: </span>
                {currentFinding.explanationDetails?.howFixWorks || currentFinding.recommendation}
              </div>
            </div>
          </div>

          {/* Evidence Trajectory Box */}
          <div className="bg-[#faf9f6] p-space-sm rounded-lg space-y-1 border border-[#e9e8e5]">
            <div className="flex items-center gap-1.5 text-[#1b1c1a] font-headline-sm text-xs">
              <span className="material-symbols-outlined text-sm text-[#ba1a1a]">bug_report</span>
              <span>Evidence</span>
            </div>
            <p className="font-code-sm text-xs text-[#44474a] leading-relaxed">
              {currentFinding.evidence}
            </p>
          </div>

          {/* Recommended Remediation */}
          <div className="space-y-1.5 bg-[#baede0]/20 p-space-sm rounded-lg border border-[#37675d]/20">
            <div className="flex items-center gap-1.5 text-[#37675d] font-headline-sm text-xs">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Remediation</span>
            </div>
            <p className="font-body-sm text-xs text-[#1e4f46] leading-relaxed">
              {currentFinding.recommendation}
            </p>
          </div>

          {/* Primary Action Cluster */}
          <div className="pt-space-xs space-y-2">
            <button
              onClick={() => onNavigate('patch-review')}
              className="w-full flex items-center justify-center gap-2 py-space-xs bg-[#000000] hover:bg-[#191c1f] text-white rounded-lg font-headline-sm text-body-base transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-sm">build</span>
              <span>Generate Patch in Workbench</span>
            </button>

            <button
              onClick={() => onNavigate('attack-replay')}
              className="w-full flex items-center justify-center gap-2 py-space-xs bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] rounded-lg font-body-base text-body-base transition-colors border border-[#e3e2df] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-[#37675d]">replay</span>
              <span>Simulate Attack Vector</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
