import React, { useState, useEffect, useRef } from 'react';
import type { AppScreen } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenNewScan: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenNewScan
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    { id: 'overview', title: 'Go to Overview / Findings Report', icon: 'dashboard', category: 'Navigation', screen: 'overview' },
    { id: 'patch-review', title: 'Open Patch Review & Remediation Workbench', icon: 'build', category: 'Workbench', screen: 'patch-review' },
    { id: 'attack-replay', title: 'Launch Attack Replay & EVM Simulation', icon: 'replay', category: 'Verification', screen: 'attack-replay' },
    { id: 'landing', title: 'Return to Editorial Landing Page', icon: 'home', category: 'Navigation', screen: 'landing' },
    { id: 'new-scan', title: 'Initiate New Solidity Contract Analysis', icon: 'play_circle', category: 'Actions', isAction: true },
    { id: 'scan-history', title: 'View Scan History & Audit Archive', icon: 'history', category: 'Reports', screen: 'scan-history' },
    { id: 'projects', title: 'Manage Protocols & Repositories', icon: 'folder_open', category: 'Projects', screen: 'projects' },
    { id: 'demo-gallery', title: 'Browse Demo Gallery of Verified Cases', icon: 'collections_bookmark', category: 'Archive', screen: 'demo-gallery' },
    { id: 'methodology', title: 'Read AST Formal Verification Methodology', icon: 'menu_book', category: 'Documentation', screen: 'methodology' },
    { id: 'settings', title: 'Compiler & Analyzer Settings', icon: 'tune', category: 'Settings', screen: 'settings' }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-xl w-full border border-[#e9e8e5] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-space-md border-b border-[#e9e8e5] flex items-center gap-3 bg-[#f4f3f0]">
          <span className="material-symbols-outlined text-xl text-[#75777a]">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, contracts, or jump to screen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-sans placeholder-[#75777a] focus:outline-none text-[#1b1c1a]"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#efeeeb] font-mono text-[10px] text-[#75777a] border border-[#e3e2df]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 divide-y divide-[#f4f3f0]">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-[#75777a]">
              No actions found for "{query}"
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleClose();
                  if (item.isAction) {
                    onOpenNewScan();
                  } else if (item.screen) {
                    onNavigate(item.screen as AppScreen);
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f4f3f0] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-[#75777a] group-hover:text-[#37675d]">
                    {item.icon}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-[#1b1c1a] block">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#75777a]">
                      {item.category}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-sm text-[#c5c6ca] group-hover:text-[#1b1c1a]">
                  arrow_forward
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#f4f3f0] border-t border-[#e9e8e5] flex items-center justify-between text-[11px] font-mono text-[#75777a] px-4">
          <span>Tip: Press ⌘K anywhere to reopen</span>
          <span className="text-[#37675d]">SecureChain Protocol</span>
        </div>
      </div>
    </div>
  );
};
