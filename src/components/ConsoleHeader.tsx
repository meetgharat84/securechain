import React, { useState } from 'react';
import type { AppScreen } from '../types';
import type { UserDoc } from '../server/models';
import { ProfileMenu } from './ProfileMenu';
import { getUserInitials, AuthService } from '../services/authService';

interface ConsoleHeaderProps {
  currentScreen: AppScreen;
  activeTarget: string;
  onSelectTarget: (target: string) => void;
  onOpenCommandPalette: () => void;
  onOpenNewScan: () => void;
  onNavigate: (screen: AppScreen) => void;
  currentUser?: UserDoc | null;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  currentScreen,
  activeTarget,
  onSelectTarget,
  onOpenCommandPalette,
  onOpenNewScan,
  onNavigate,
  currentUser
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const targets = ['Treasury Protocol', 'Uniswap V4 Hook', 'Compound Fork', 'Curve Pool V2'];

  const getBreadcrumbLabel = () => {
    switch (currentScreen) {
      case 'overview': return 'Workspace / Findings';
      case 'patch-review': return 'Workbench / Patch #01';
      case 'attack-replay': return 'Verification / Replay Suite';
      case 'scan-history': return 'Reports / Scan History';
      case 'projects': return 'Repositories / Projects';
      case 'demo-gallery': return 'Archive / Demo Gallery';
      case 'methodology': return 'Documentation / Methodology';
      case 'settings': return 'System / Settings';
      default: return 'Workspace';
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#faf9f6]/90 backdrop-blur-md z-40 flex items-center justify-between px-space-lg border-b border-[#e9e8e5] select-none">
      {/* Left: Breadcrumbs & Quick Search Trigger */}
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs font-code-sm text-code-sm text-[#44474a]">
          <button 
            onClick={() => onNavigate('overview')}
            className="hover:text-[#1b1c1a] transition-colors"
          >
            Console
          </button>
          <span>/</span>
          <span className="text-[#1b1c1a] font-medium">{getBreadcrumbLabel()}</span>
        </div>

        <button 
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-space-xs px-space-sm py-1 rounded bg-[#efeeeb] text-[#44474a] hover:text-[#1b1c1a] hover:bg-[#e9e8e5] transition-colors font-code-sm text-code-sm shadow-2xs"
          title="Open search and commands"
        >
          <span className="material-symbols-outlined text-sm">terminal</span>
          <span>Search or command</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#faf9f6] font-code-sm text-code-sm text-[#1b1c1a] shadow-xs border border-[#e3e2df]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md relative">
        {/* Editorial Site Link */}
        <button
          onClick={() => onNavigate('landing')}
          className="hidden sm:inline-flex items-center gap-1 px-space-xs py-1 text-xs text-[#44474a] hover:text-[#1b1c1a] hover:bg-[#efeeeb] rounded transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Editorial Home</span>
        </button>

        {/* Target Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-[#efeeeb] text-[#1b1c1a] hover:bg-[#e9e8e5] transition-colors text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-base text-[#37675d]">shield</span>
            <span className="font-code-sm text-code-sm font-semibold">{activeTarget}</span>
            <span className="material-symbols-outlined text-sm text-[#44474a]">arrow_drop_down</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#ffffff] border border-[#e9e8e5] rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-mono text-[#75777a] uppercase tracking-wider">
                Select Protocol
              </div>
              {targets.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    onSelectTarget(t);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-[#f4f3f0] ${
                    activeTarget === t ? 'text-[#37675d] font-semibold bg-[#baede0]/20' : 'text-[#1b1c1a]'
                  }`}
                >
                  <span>{t}</span>
                  {activeTarget === t && (
                    <span className="material-symbols-outlined text-xs">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <button 
          onClick={() => alert('All live invariant checks are operating within normal parameters. Zero critical telemetry anomalies.')}
          className="p-1.5 rounded text-[#44474a] hover:text-[#1b1c1a] hover:bg-[#efeeeb] transition-colors relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#37675d]"></span>
        </button>

        {/* New Scan Primary Action */}
        <button
          onClick={onOpenNewScan}
          className="flex items-center gap-space-2xs px-space-sm py-space-xs bg-[#000000] text-[#ffffff] rounded-lg font-headline-sm text-body-sm hover:bg-[#191c1f] transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Scan</span>
        </button>

        {/* User Avatar with Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center rounded-full transition-transform active:scale-95 cursor-pointer focus:outline-none"
            title="Open Profile Menu"
          >
            {currentUser?.avatar ? (
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-[#c5c6ca] hover:border-[#37675d] transition-colors"
                src={currentUser.avatar}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#37675d] text-[#ffffff] font-semibold text-xs flex items-center justify-center border border-[#c5c6ca] hover:border-[#37675d] transition-colors select-none">
                {getUserInitials(currentUser?.name, currentUser?.email)}
              </div>
            )}
          </button>

          <ProfileMenu
            isOpen={profileMenuOpen}
            onClose={() => setProfileMenuOpen(false)}
            onNavigate={onNavigate}
            onOpenCommandPalette={onOpenCommandPalette}
            userName={currentUser?.name || AuthService.deriveNameFromEmail(currentUser?.email || '')}
            userEmail={currentUser?.email || ''}
            userAvatar={currentUser?.avatar}
            workspaceName={activeTarget}
          />
        </div>
      </div>
    </header>
  );
};
