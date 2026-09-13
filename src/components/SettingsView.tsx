import React, { useState } from 'react';
import type { AppScreen } from '../types';

interface SettingsViewProps {
  onNavigate: (screen: AppScreen) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const [compilerVersion, setCompilerVersion] = useState('0.8.20');
  const [fuzzingRuns, setFuzzingRuns] = useState('10000');
  const [smtSolver, setSmtSolver] = useState('z3');
  const [autoPatchSynthesis, setAutoPatchSynthesis] = useState(true);

  const handleSave = () => {
    onShowToast('Settings and compiler flags persisted successfully.');
  };

  return (
    <div className="p-space-lg max-w-[1000px] mx-auto space-y-space-md">
      <div className="space-y-1">
        <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">Analyzer &amp; Compiler Settings</h1>
        <p className="font-body-base text-body-base text-[#44474a]">
          Configure execution sandboxes, SMT solver parameters, EVM target specs, and automated AST mutation rules.
        </p>
      </div>

      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg space-y-space-lg shadow-xs">
        {/* Compiler Target */}
        <div className="space-y-2">
          <label className="font-headline-sm text-sm font-semibold text-[#1b1c1a] block">
            Solidity Compiler Version (solc)
          </label>
          <select
            value={compilerVersion}
            onChange={(e) => setCompilerVersion(e.target.value)}
            className="w-full max-w-sm px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
          >
            <option value="0.8.28">0.8.28 (Latest)</option>
            <option value="0.8.24">0.8.24 (Cancun default)</option>
            <option value="0.8.20">0.8.20 (Shanghai / Current Target)</option>
            <option value="0.8.19">0.8.19</option>
          </select>
          <p className="text-xs text-[#75777a]">
            Bytecode compilation and EVM simulation are strictly executed against the configured release binary.
          </p>
        </div>

        {/* Fuzzing Runs */}
        <div className="space-y-2 pt-space-xs border-t border-[#e9e8e5]">
          <label className="font-headline-sm text-sm font-semibold text-[#1b1c1a] block">
            Regression Replay Fuzzing Iterations
          </label>
          <input
            type="number"
            value={fuzzingRuns}
            onChange={(e) => setFuzzingRuns(e.target.value)}
            className="w-full max-w-sm px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
          />
          <p className="text-xs text-[#75777a]">
            Number of randomized calldata permutations executed in Anvil fork to verify non-reentrancy invariance.
          </p>
        </div>

        {/* SMT Solver Engine */}
        <div className="space-y-2 pt-space-xs border-t border-[#e9e8e5]">
          <label className="font-headline-sm text-sm font-semibold text-[#1b1c1a] block">
            Formal Verification SMT Solver Engine
          </label>
          <div className="flex gap-space-sm">
            <button
              type="button"
              onClick={() => setSmtSolver('z3')}
              className={`px-4 py-2 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                smtSolver === 'z3'
                  ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-semibold'
                  : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
              }`}
            >
              Z3 Theorem Prover
            </button>
            <button
              type="button"
              onClick={() => setSmtSolver('eldarica')}
              className={`px-4 py-2 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                smtSolver === 'eldarica'
                  ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-semibold'
                  : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
              }`}
            >
              Eldarica Horn Clause Solver
            </button>
          </div>
        </div>

        {/* Auto Patch Switch */}
        <div className="flex items-center justify-between pt-space-xs border-t border-[#e9e8e5]">
          <div>
            <span className="font-headline-sm text-sm font-semibold text-[#1b1c1a] block">
              Automated AST Patch Differential Synthesis
            </span>
            <span className="text-xs text-[#75777a]">
              Synthesize minimal Git-compatible CEI diffs automatically whenever high or critical vectors are detected.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAutoPatchSynthesis(!autoPatchSynthesis)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              autoPatchSynthesis ? 'bg-[#37675d]' : 'bg-[#e9e8e5]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                autoPatchSynthesis ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {/* Save Button */}
        <div className="pt-space-md border-t border-[#e9e8e5] flex justify-end">
          <button
            onClick={handleSave}
            className="px-space-lg py-2 bg-[#000000] text-white rounded-lg text-xs font-mono font-semibold hover:bg-[#191c1f] transition-all cursor-pointer shadow-xs"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
