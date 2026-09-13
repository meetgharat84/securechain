import React, { useEffect, useState } from 'react';
import type { AppScreen } from '../types';

interface ScanProgressViewProps {
  contractName: string;
  onComplete: () => void;
  onCancel: () => void;
  onNavigate: (screen: AppScreen) => void;
}

interface ProgressStageDefinition {
  name: string;
  desc: string;
  durationMs: number;
}

const PIPELINE_STAGES: ProgressStageDefinition[] = [
  { name: 'Source received', desc: 'SHA-256 integrity hash and encoding verified', durationMs: 300 },
  { name: 'Compiler check', desc: 'solc 0.8.20 syntax and symbol table validation', durationMs: 450 },
  { name: 'AST generated', desc: '68 syntax nodes and inheritance tree mapped', durationMs: 400 },
  { name: 'Security rules running', desc: 'Evaluating reentrancy, access control & external calls', durationMs: 650 },
  { name: 'Findings normalized', desc: 'Mapping SWC-107/105/104 IDs to AST line spans', durationMs: 350 },
  { name: 'AI explanation prepared', desc: 'Synthesizing beginner-friendly remediation guidance', durationMs: 500 },
  { name: 'Report generated', desc: 'Differential patch harness and telemetry consolidated', durationMs: 350 },
];

export const ScanProgressView: React.FC<ScanProgressViewProps> = ({
  contractName,
  onComplete,
  onCancel,
  onNavigate,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [overallStatus, setOverallStatus] = useState<'queued' | 'running' | 'completed' | 'failed' | 'cancelled'>('running');
  const [logs, setLogs] = useState<string[]>([
    `[INIT] Received target contract: ${contractName}`,
    '[COMPILER] Probing solc release 0.8.20 against EVM Cancun targets...',
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStageIdx < PIPELINE_STAGES.length) {
      const stage = PIPELINE_STAGES[currentStageIdx];
      timer = setTimeout(() => {
        // Add telemetry log
        setLogs((prev) => [
          ...prev,
          `[STAGE ${currentStageIdx + 1}/7] ${stage.name}: Done (${stage.desc})`,
        ]);

        if (currentStageIdx + 1 === PIPELINE_STAGES.length) {
          setOverallStatus('completed');
          setTimeout(() => {
            onComplete();
          }, 600);
        } else {
          setCurrentStageIdx((idx) => idx + 1);
        }
      }, stage.durationMs);
    }

    return () => clearTimeout(timer);
  }, [currentStageIdx, onComplete]);

  return (
    <div className="p-space-lg max-w-[1200px] mx-auto space-y-space-md animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#37675d] animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-[#37675d] uppercase font-semibold">
              Scan Pipeline Active
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">
            Analyzing {contractName}
          </h1>
          <p className="font-body-base text-body-base text-[#44474a]">
            Executing compiler verification, AST traversal, deterministic pattern rules, and AI remediation synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('overview')}
            className="px-space-md py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#f3f4f1] text-[#44474a] font-body-base text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            Jump to Results
          </button>
          <button
            onClick={() => {
              setOverallStatus('cancelled');
              onCancel();
            }}
            className="px-space-md py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-body-base text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            Cancel Scan
          </button>
        </div>
      </div>

      {/* 2-Column Progress & Live Telemetry Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Stages Checklist */}
        <div className="lg:col-span-6 bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg shadow-xs space-y-space-md">
          <div className="flex items-center justify-between border-b border-[#e9e8e5] pb-3">
            <span className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
              Pipeline Stages ({Math.min(currentStageIdx + 1, 7)}/7)
            </span>
            <span className="font-code-sm text-xs text-[#37675d] font-semibold">
              {overallStatus === 'completed' ? '100% Completed' : `${Math.round(((currentStageIdx) / 7) * 100)}%`}
            </span>
          </div>

          <div className="space-y-3">
            {PIPELINE_STAGES.map((stage, idx) => {
              const status = idx < currentStageIdx ? 'completed' : idx === currentStageIdx ? 'active' : 'pending';
              return (
                <div
                  key={stage.name}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    status === 'active'
                      ? 'bg-[#baede0]/20 border-[#37675d] shadow-xs'
                      : status === 'completed'
                      ? 'bg-[#ffffff] border-[#e9e8e5]'
                      : 'bg-[#f4f3f0]/50 border-transparent opacity-60'
                  }`}
                >
                  <div className="mt-0.5">
                    {status === 'completed' ? (
                      <span className="material-symbols-outlined text-lg text-[#37675d]">check_circle</span>
                    ) : status === 'active' ? (
                      <span className="w-4 h-4 border-2 border-[#37675d] border-t-transparent rounded-full animate-spin block mt-0.5"></span>
                    ) : (
                      <span className="material-symbols-outlined text-lg text-[#c5c6ca]">radio_button_unchecked</span>
                    )}
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${status === 'active' ? 'text-[#1e4f46]' : 'text-[#1b1c1a]'}`}>
                        {stage.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#75777a]">Stage 0{idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-[#75777a]">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Log Output */}
        <div className="lg:col-span-6 bg-[#191c1f] rounded-xl border border-white/10 p-space-md shadow-xl flex flex-col justify-between text-white font-mono text-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[#828488]">
              <span className="text-[#c5c6ca] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#86d6bb] animate-pulse"></span>
                Analyzer Telemetry Daemon
              </span>
              <span className="text-[10px] uppercase tracking-wider">solc 0.8.20</span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {logs.map((log, index) => (
                <div key={index} className="text-[#c5c6ca] leading-relaxed">
                  <span className="text-[#75777a] mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              {overallStatus === 'running' && (
                <div className="flex items-center gap-2 text-[#86d6bb] pt-1">
                  <span className="w-1.5 h-3 bg-[#86d6bb] animate-pulse"></span>
                  <span>Executing AST traversal...</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#828488]">
            <span>Deterministic verification active</span>
            <span className="text-[#86d6bb]">Zero false positives</span>
          </div>
        </div>
      </div>
    </div>
  );
};
