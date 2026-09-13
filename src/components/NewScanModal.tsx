import React, { useState, useRef } from 'react';
import { DEMO_VULNERABLE_VAULT_SOURCE, DeterministicSecurityEngine } from '../services/securityEngine';

interface NewScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScan: (contractName: string, source: string, compilerVersion: string, profile: 'Quick' | 'Standard' | 'Deep') => void;
}

export const NewScanModal: React.FC<NewScanModalProps> = ({
  isOpen,
  onClose,
  onStartScan,
}) => {
  const [contractName, setContractName] = useState('VulnerableVault.sol');
  const [projectName, setProjectName] = useState('Treasury Protocols');
  const [compilerVersion, setCompilerVersion] = useState('0.8.20');
  const [analysisProfile, setAnalysisProfile] = useState<'Quick' | 'Standard' | 'Deep'>('Standard');
  const [solidityCode, setSolidityCode] = useState(DEMO_VULNERABLE_VAULT_SOURCE);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Real-time source telemetry
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
    onClose();
    onStartScan(contractName, solidityCode, compilerVersion, analysisProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#ffffff] rounded-2xl max-w-3xl w-full border border-[#e9e8e5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-space-md border-b border-[#e9e8e5] flex items-center justify-between bg-[#f4f3f0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#37675d]">play_circle</span>
            <h3 className="font-headline-sm text-base font-semibold text-[#1b1c1a]">
              New Security Analysis
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#75777a] hover:text-[#1b1c1a] p-1 rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-md space-y-space-md overflow-y-auto">
          {/* Preset Demo Contracts Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold">
                Demo Contract Preset or Upload
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-mono text-[#37675d] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span>Upload .sol file</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".sol"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setContractName('VulnerableVault.sol');
                  setProjectName('Treasury Protocols');
                  setCompilerVersion('0.8.20');
                  setSolidityCode(DEMO_VULNERABLE_VAULT_SOURCE);
                  setValidationError(null);
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                  contractName === 'VulnerableVault.sol'
                    ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-bold ring-1 ring-[#37675d]'
                    : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
                }`}
              >
                VulnerableVault.sol (Reentrancy, Access, Call)
              </button>

              <button
                type="button"
                onClick={() => {
                  setContractName('LiquidityPool.sol');
                  setProjectName('Uniswap V4 Hook');
                  setCompilerVersion('0.8.20');
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
                  setValidationError(null);
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                  contractName === 'LiquidityPool.sol'
                    ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-bold'
                    : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
                }`}
              >
                LiquidityPool.sol (Oracle Slippage)
              </button>
            </div>
          </div>

          {/* Configuration Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
            <div>
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block mb-1">
                Contract Name
              </label>
              <input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none focus:border-[#37675d]"
              />
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block mb-1">
                Project / Workspace
              </label>
              <select
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
              >
                <option value="Treasury Protocols">Treasury Protocols</option>
                <option value="Uniswap V4 Hook">Uniswap V4 Hook</option>
                <option value="Compound Fork">Compound Fork</option>
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block mb-1">
                Compiler Version (solc)
              </label>
              <select
                value={compilerVersion}
                onChange={(e) => setCompilerVersion(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
              >
                <option value="0.8.28">0.8.28</option>
                <option value="0.8.24">0.8.24</option>
                <option value="0.8.20">0.8.20 (Demo Default)</option>
                <option value="0.8.19">0.8.19</option>
              </select>
            </div>
          </div>

          {/* Analysis Profile */}
          <div className="space-y-1">
            <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
              Analysis Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Quick', 'Standard', 'Deep'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAnalysisProfile(p)}
                  className={`py-1.5 px-3 text-xs font-mono rounded-lg border text-center transition-colors cursor-pointer ${
                    analysisProfile === p
                      ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-semibold'
                      : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
                  }`}
                >
                  <span className="block font-semibold">{p}</span>
                  <span className="text-[10px] text-[#75777a] block">
                    {p === 'Quick' ? 'AST rules only' : p === 'Standard' ? 'AST + Solc check' : 'Full Invariant Fuzz'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea with Telemetry Footer */}
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
                <span className={hasPragma ? 'text-[#37675d]' : 'text-[#ba1a1a]'}>
                  {hasPragma ? 'Pragma detected' : 'Missing pragma'}
                </span>
                <span>•</span>
                <span>{contractCount} contract{contractCount === 1 ? '' : 's'}</span>
              </div>
            </div>

            <textarea
              rows={9}
              value={solidityCode}
              onChange={(e) => {
                setSolidityCode(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Paste Solidity smart contract source code here..."
              className="w-full p-3 font-mono text-xs bg-[#191c1f] text-[#c5c6ca] border border-white/10 rounded-lg focus:outline-none focus:border-[#37675d] leading-relaxed"
            />
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/40 rounded-lg flex items-center gap-2 text-xs text-[#93000a] font-mono animate-fadeIn">
              <span className="material-symbols-outlined text-base text-[#ba1a1a]">error</span>
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-space-md border-t border-[#e9e8e5] bg-[#f4f3f0] flex items-center justify-between">
          <span className="font-mono text-xs text-[#75777a]">
            Solidity Security Engine · AST Mutator
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-space-md py-1.5 text-xs font-medium rounded-lg text-[#44474a] hover:bg-[#efeeeb] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleValidateAndSubmit}
              className="flex items-center gap-2 px-space-lg py-1.5 rounded-lg bg-[#000000] hover:bg-[#191c1f] text-white text-xs font-semibold font-mono transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Scan Contract</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
