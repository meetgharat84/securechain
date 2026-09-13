import React, { useState, useRef } from 'react';
import type { AppScreen } from '../types';
import { DEMO_VULNERABLE_VAULT_SOURCE, DeterministicSecurityEngine } from '../services/securityEngine';

interface NewAnalysisViewProps {
  onNavigate: (screen: AppScreen) => void;
  onStartScan: (contractName: string, source: string, compilerVersion: string, profile: 'Quick' | 'Standard' | 'Deep') => void;
  onShowToast: (msg: string) => void;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  onNavigate,
  onStartScan,
  onShowToast,
}) => {
  const [contractName, setContractName] = useState('VulnerableVault.sol');
  const [projectName, setProjectName] = useState('Treasury Protocols');
  const [compilerVersion, setCompilerVersion] = useState('0.8.20');
  const [analysisProfile, setAnalysisProfile] = useState<'Quick' | 'Standard' | 'Deep'>('Standard');
  const [solidityCode, setSolidityCode] = useState(DEMO_VULNERABLE_VAULT_SOURCE);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const codeLines = solidityCode.split('\n').length;
  const codeBytes = new Blob([solidityCode]).size;
  const hasPragma = /pragma\s+solidity/i.test(solidityCode);
  const contractCount = (solidityCode.match(/contract\s+[A-Za-z0-9_]+/g) || []).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.sol')) {
      setValidationError('Please upload a valid .sol Solidity file.');
      return;
    }

    if (file.size > 500000) {
      setValidationError('File size exceeds the 500KB security limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSolidityCode(content);
      setContractName(file.name);
      setValidationError(null);
      onShowToast(`Uploaded ${file.name} successfully.`);
    };
    reader.readAsText(file);
  };

  const handleValidateAndSubmit = () => {
    const validation = DeterministicSecurityEngine.validateSource(solidityCode);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid Solidity source code.');
      return;
    }

    if (!['0.8.28', '0.8.24', '0.8.20', '0.8.19'].includes(compilerVersion)) {
      setValidationError(`Unsupported compiler version ${compilerVersion}. Please select a supported release.`);
      return;
    }

    setValidationError(null);
    onStartScan(contractName, solidityCode, compilerVersion, analysisProfile);
  };

  return (
    <div className="p-space-lg max-w-[1400px] mx-auto space-y-space-md animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#37675d]">play_circle</span>
            <span className="font-label-caps text-xs text-[#37675d] uppercase font-semibold">
              New Security Analysis
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">
            Submit Contract for Deterministic Verification
          </h1>
          <p className="font-body-base text-body-base text-[#44474a]">
            Select a verified demo contract or paste Solidity source code to run AST inspection, reentrancy detection, and AI patch generation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('overview')}
            className="px-space-md py-space-xs rounded-lg text-[#75777a] hover:text-[#1b1c1a] hover:bg-[#efeeeb] font-mono text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-space-md py-space-xs rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] font-mono text-xs transition-colors border border-[#e3e2df] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            <span>Upload .sol File</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".sol"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Main Workspace Card */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg shadow-xs space-y-space-md">
        {/* Preset Selection Buttons */}
        <div className="space-y-1.5">
          <label className="font-label-caps text-xs text-[#75777a] uppercase font-semibold block">
            Select Contract Preset
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setContractName('VulnerableVault.sol');
                setSolidityCode(DEMO_VULNERABLE_VAULT_SOURCE);
                setCompilerVersion('0.8.20');
                setValidationError(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                contractName === 'VulnerableVault.sol'
                  ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-bold ring-1 ring-[#37675d]'
                  : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
              }`}
            >
              VulnerableVault.sol (Reentrancy, Access Control, External Call)
            </button>

            <button
              type="button"
              onClick={() => {
                setContractName('LiquidityPool.sol');
                setSolidityCode(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LiquidityPool {
    mapping(address => uint256) public reserves;
    address public feeRecipient;

    function swap(uint256 amountIn, uint256 minOut) external returns (uint256 amountOut) {
        amountOut = (amountIn * reserves[msg.sender]) / 1000;
        require(amountOut >= minOut, "Slippage");
    }
}`);
                setCompilerVersion('0.8.20');
                setValidationError(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                contractName === 'LiquidityPool.sol'
                  ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-bold'
                  : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
              }`}
            >
              LiquidityPool.sol (Oracle Slippage)
            </button>
          </div>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
          <div>
            <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block mb-1">
              Contract Name
            </label>
            <input
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none focus:border-[#37675d]"
            />
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block mb-1">
              Project Selector
            </label>
            <select
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
            >
              <option value="Treasury Protocols">Treasury Protocols</option>
              <option value="Uniswap V4 Hook">Uniswap V4 Hook</option>
              <option value="Compound Fork">Compound Fork</option>
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block mb-1">
              Solidity Compiler Version (solc)
            </label>
            <select
              value={compilerVersion}
              onChange={(e) => setCompilerVersion(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
            >
              <option value="0.8.28">0.8.28 (Latest)</option>
              <option value="0.8.24">0.8.24</option>
              <option value="0.8.20">0.8.20 (Default)</option>
              <option value="0.8.19">0.8.19</option>
            </select>
          </div>
        </div>

        {/* Analysis Profile */}
        <div className="space-y-1">
          <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
            Analysis Profile
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Quick', 'Standard', 'Deep'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAnalysisProfile(p)}
                className={`py-2 px-3 text-xs font-mono rounded-lg border text-left transition-colors cursor-pointer ${
                  analysisProfile === p
                    ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-semibold ring-1 ring-[#37675d]'
                    : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
                }`}
              >
                <span className="block font-bold">{p}</span>
                <span className="text-[10px] text-[#75777a] block mt-0.5">
                  {p === 'Quick' ? 'Deterministic AST pattern rules' : p === 'Standard' ? 'AST rules + solc parser check' : 'Full symbolic solver + fuzzing harness'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Deck */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
              Solidity Source Code
            </label>
            <div className="flex items-center gap-3 font-mono text-[10px] text-[#75777a]">
              <span>{codeLines} lines</span>
              <span>•</span>
              <span>{(codeBytes / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span className={hasPragma ? 'text-[#37675d] font-semibold' : 'text-[#ba1a1a]'}>
                {hasPragma ? 'Pragma: 0.8.20' : 'Missing pragma'}
              </span>
              <span>•</span>
              <span>{contractCount} contract{contractCount === 1 ? '' : 's'}</span>
            </div>
          </div>

          <textarea
            rows={12}
            value={solidityCode}
            onChange={(e) => {
              setSolidityCode(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Paste Solidity contract source code here..."
            className="w-full p-4 font-mono text-xs bg-[#191c1f] text-[#c5c6ca] border border-white/10 rounded-lg focus:outline-none focus:border-[#37675d] leading-relaxed"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/40 rounded-lg flex items-center gap-2 text-xs text-[#93000a] font-mono animate-fadeIn">
            <span className="material-symbols-outlined text-base text-[#ba1a1a]">error</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-space-sm border-t border-[#e9e8e5] flex items-center justify-between">
          <span className="font-mono text-xs text-[#75777a]">
            Pre-flight AST validation active
          </span>
          <button
            onClick={handleValidateAndSubmit}
            className="flex items-center gap-2 px-space-xl py-2.5 rounded-lg bg-[#000000] hover:bg-[#191c1f] text-white text-xs font-semibold font-mono transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>Scan Contract</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
