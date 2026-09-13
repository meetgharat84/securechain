import React from 'react';
import type { AppScreen } from '../types';

interface DemoGalleryViewProps {
  onNavigate: (screen: AppScreen) => void;
  onSelectFindingForWorkbench?: () => void;
}

export const DemoGalleryView: React.FC<DemoGalleryViewProps> = ({
  onNavigate,
  onSelectFindingForWorkbench
}) => {
  const demos = [
    {
      id: 'demo-1',
      title: 'Reentrancy Vulnerability (SWC-107)',
      contract: 'VaultLiquidityReserve.sol',
      vector: 'External untrusted call precedes state mutation in withdrawal lifecycle.',
      patchType: 'Checks-Effects-Interactions + OpenZeppelin ReentrancyGuard',
      scoreBefore: 42,
      scoreAfter: 94,
      status: 'Verified Safe'
    },
    {
      id: 'demo-2',
      title: 'Missing Access Control on Critical Setter',
      contract: 'TreasuryController.sol',
      vector: 'Unrestricted execution of setTreasuryDrain() allows arbitrary recipient reassignment.',
      patchType: 'Ownable2Step + AccessControlDefaultAdminRules',
      scoreBefore: 55,
      scoreAfter: 98,
      status: 'Verified Safe'
    },
    {
      id: 'demo-3',
      title: 'Unchecked Return on Non-Compliant ERC20',
      contract: 'CollateralEscrow.sol',
      vector: 'Silent boolean transfer failure allows false accounting balance increments.',
      patchType: 'OpenZeppelin SafeERC20.safeTransfer()',
      scoreBefore: 68,
      scoreAfter: 99,
      status: 'Verified Safe'
    }
  ];

  return (
    <div className="p-space-lg max-w-[1400px] mx-auto space-y-space-md">
      <div className="space-y-1">
        <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">Demo Gallery &amp; Verified Cases</h1>
        <p className="font-body-base text-body-base text-[#44474a]">
          Curated collection of classic Solidity vulnerabilities, automated AST patch diffs, and reproducible formal proof test harnesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {demos.map((d) => (
          <div
            key={d.id}
            className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-md flex flex-col justify-between space-y-space-md shadow-xs hover:shadow-md transition-all"
          >
            <div className="space-y-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] text-[#37675d] uppercase tracking-wider font-bold bg-[#baede0]/40 px-2 py-0.5 rounded-full">
                  {d.status}
                </span>
                <span className="font-mono text-xs text-[#75777a]">{d.contract}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">{d.title}</h3>
                <p className="font-body-sm text-xs text-[#44474a] leading-relaxed">{d.vector}</p>
              </div>

              <div className="bg-[#f4f3f0] p-2.5 rounded-lg text-xs font-mono space-y-1 border border-[#e9e8e5]">
                <span className="text-[10px] text-[#75777a] uppercase font-bold">Applied AST Patch</span>
                <div className="text-[#37675d] font-semibold">{d.patchType}</div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <span className="text-[#ba1a1a]">Unpatched: {d.scoreBefore}/100</span>
                <span className="text-[#75777a]">&rarr;</span>
                <span className="text-[#37675d] font-bold">Patched: {d.scoreAfter}/100</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectFindingForWorkbench) onSelectFindingForWorkbench();
                onNavigate('patch-review');
              }}
              className="w-full py-2 bg-[#191c1f] hover:bg-[#000000] text-white rounded-lg font-mono text-xs transition-all cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-1"
            >
              <span>Inspect Workbench Proof</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
