import React from 'react';
import type { AppScreen } from '../types';
import { SCAN_HISTORY_DATA } from '../data/mockData';

interface ScanHistoryViewProps {
  onNavigate: (screen: AppScreen) => void;
  onSelectTarget: (target: string) => void;
  onOpenNewScan: () => void;
  onShowToast: (msg: string) => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  onNavigate,
  onSelectTarget,
  onOpenNewScan,
  onShowToast
}) => {
  return (
    <div className="p-space-lg max-w-[1400px] mx-auto space-y-space-md">
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">Scan History &amp; Audit Archive</h1>
          <p className="font-body-base text-body-base text-[#44474a]">
            Complete historical log of AST analysis runs, differential patch evaluations, and formal proofs.
          </p>
        </div>
        <button
          onClick={onOpenNewScan}
          className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-[#000000] text-white font-headline-sm text-xs hover:bg-[#191c1f] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Analysis</span>
        </button>
      </div>

      {/* History Table */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#f4f3f0] border-b border-[#e9e8e5] text-[#75777a] font-label-caps uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Protocol Target</th>
                <th className="py-3 px-4">Contract File</th>
                <th className="py-3 px-4">Security Score</th>
                <th className="py-3 px-4">Vulnerabilities</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e8e5]">
              {SCAN_HISTORY_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-[#faf9f6] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#37675d]">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-sm font-medium text-[#1b1c1a]">
                    {row.target}
                  </td>
                  <td className="py-3.5 px-4 text-[#44474a]">
                    {row.contract}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded font-semibold ${
                        row.score < 50
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : row.score < 80
                          ? 'bg-[#fff8e1] text-[#c28400]'
                          : 'bg-[#baede0] text-[#1e4f46]'
                      }`}
                    >
                      {row.score} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {row.findingsCount.critical > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold">
                          {row.findingsCount.critical} Crit
                        </span>
                      )}
                      {row.findingsCount.high > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#e06d53] text-white text-[10px] font-bold">
                          {row.findingsCount.high} High
                        </span>
                      )}
                      {row.findingsCount.medium > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#c28400] text-white text-[10px] font-bold">
                          {row.findingsCount.medium} Med
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#75777a]">
                    {row.date}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        onSelectTarget(row.target);
                        onNavigate('overview');
                      }}
                      className="px-3 py-1 rounded bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] transition-colors cursor-pointer mr-2"
                    >
                      Inspect Report
                    </button>
                    <button
                      onClick={() => onShowToast(`Exporting bundle for ${row.id}...`)}
                      className="p-1 rounded text-[#75777a] hover:text-[#1b1c1a] transition-colors cursor-pointer"
                      title="Download JSON telemetry"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
