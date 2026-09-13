import React from 'react';
import type { AppScreen } from '../types';

interface ProjectsViewProps {
  onNavigate: (screen: AppScreen) => void;
  onSelectTarget: (target: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate, onSelectTarget }) => {
  const projects = [
    {
      name: 'Treasury Protocol',
      contractsCount: 4,
      score: 42,
      lastScan: '2 minutes ago',
      findings: { crit: 1, high: 2, med: 1, low: 0 },
      branch: 'main',
      status: 'Action Required'
    },
    {
      name: 'Uniswap V4 Hook',
      contractsCount: 2,
      score: 88,
      lastScan: 'Yesterday',
      findings: { crit: 0, high: 1, med: 2, low: 1 },
      branch: 'audit/hooks',
      status: 'Nominal'
    },
    {
      name: 'Compound Fork',
      contractsCount: 8,
      score: 94,
      lastScan: '3 days ago',
      findings: { crit: 0, high: 0, med: 1, low: 2 },
      branch: 'release/v2.1',
      status: 'Verified'
    },
    {
      name: 'Curve Pool V2',
      contractsCount: 3,
      score: 91,
      lastScan: '1 week ago',
      findings: { crit: 0, high: 0, med: 2, low: 0 },
      branch: 'production',
      status: 'Verified'
    }
  ];

  return (
    <div className="p-space-lg max-w-[1400px] mx-auto space-y-space-md">
      <div className="space-y-1">
        <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">Active Projects &amp; Repositories</h1>
        <p className="font-body-base text-body-base text-[#44474a]">
          Continuous AST monitoring of tracked Solidity repositories, branches, and multi-contract deployment pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {projects.map((p) => (
          <div
            key={p.name}
            className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md flex flex-col justify-between space-y-space-md shadow-xs hover:border-[#37675d]/50 transition-all"
          >
            <div className="space-y-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#37675d]">folder</span>
                  <h3 className="font-headline-sm text-base font-semibold text-[#1b1c1a]">{p.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-xs font-semibold ${
                    p.status === 'Action Required'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : 'bg-[#baede0] text-[#1e4f46]'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono py-2 border-y border-[#e9e8e5]">
                <div>
                  <span className="text-[#75777a] block text-[10px] uppercase font-bold">Contracts</span>
                  <span className="text-[#1b1c1a] font-semibold">{p.contractsCount} files</span>
                </div>
                <div>
                  <span className="text-[#75777a] block text-[10px] uppercase font-bold">Health Score</span>
                  <span
                    className={`font-semibold ${
                      p.score < 50 ? 'text-[#ba1a1a]' : p.score < 85 ? 'text-[#c28400]' : 'text-[#37675d]'
                    }`}
                  >
                    {p.score}/100
                  </span>
                </div>
                <div>
                  <span className="text-[#75777a] block text-[10px] uppercase font-bold">Git Branch</span>
                  <span className="text-[#44474a] truncate block">{p.branch}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#75777a] font-mono">Last run: {p.lastScan}</span>
              <button
                onClick={() => {
                  onSelectTarget(p.name);
                  onNavigate('overview');
                }}
                className="px-space-md py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-mono text-xs transition-colors cursor-pointer"
              >
                Open Workspace &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
