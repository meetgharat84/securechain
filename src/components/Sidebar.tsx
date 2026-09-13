import React from 'react';
import type { AppScreen } from '../types';
import type { UserDoc } from '../server/models';
import { SHIELD_LOGO_URL } from '../data/mockData';
import { getUserInitials, AuthService } from '../services/authService';

interface SidebarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  activeTarget: string;
  onSelectTarget: (target: string) => void;
  onOpenNewScan: () => void;
  currentUser?: UserDoc | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  activeTarget,
  onSelectTarget,
  onOpenNewScan,
  currentUser
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'new-analysis', label: 'New Analysis', icon: 'play_circle', isAction: true },
    { id: 'scan-history', label: 'Scan History', icon: 'history' },
    { id: 'projects', label: 'Projects', icon: 'folder_open' },
    { id: 'demo-gallery', label: 'Demo Gallery', icon: 'collections_bookmark' },
    { id: 'methodology', label: 'Methodology', icon: 'menu_book' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#f4f3f0] border-r border-[#e9e8e5] z-50 flex flex-col justify-between py-space-md select-none">
      <div className="flex flex-col gap-space-md">
        {/* Logo Brand Anchor */}
        <button 
          onClick={() => onNavigate('landing')}
          className="px-space-md flex items-center gap-space-xs text-left group transition-transform active:scale-98"
          title="Return to SecureChain AI Editorial Landing"
        >
          <img
            alt="SecureChain AI Shield Logo"
            className="h-7 w-auto object-contain"
            src={SHIELD_LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-[#1b1c1a] leading-tight group-hover:text-black">
              SecureChain
            </span>
            <span className="font-label-caps text-label-caps text-[#37675d] uppercase tracking-wider font-semibold">
              Protocol Core
            </span>
          </div>
        </button>

        {/* Divider */}
        <div className="px-space-md">
          <div className="h-px w-full bg-[#e9e8e5]"></div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-space-xs">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction) {
                    onOpenNewScan();
                  } else {
                    onNavigate(item.id as AppScreen);
                  }
                }}
                className={`flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg transition-colors text-left w-full ${
                  isActive
                    ? 'bg-[#e9e8e5] text-[#1b1c1a] font-semibold shadow-xs'
                    : 'text-[#44474a] hover:bg-[#efeeeb] hover:text-[#1b1c1a]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span className="font-body-base text-body-base">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status, Target & Auditor Profile */}
      <div className="px-space-md flex flex-col gap-space-sm">
        {/* Analyzer Status */}
        <div className="flex items-center justify-between px-space-xs py-space-2xs rounded bg-[#efeeeb]">
          <div className="flex items-center gap-space-2xs">
            <span className="w-2 h-2 rounded-full bg-[#37675d] animate-pulse"></span>
            <span className="font-code-sm text-code-sm text-[#3e6d63] font-medium">Analyzer Ready</span>
          </div>
          <span className="font-label-caps text-label-caps text-[#44474a]">ONLINE</span>
        </div>

        {/* Active Target Switcher */}
        <div 
          onClick={() => {
            const targets = ['Treasury Protocol', 'Uniswap V4 Hook', 'Compound Fork', 'Curve Pool V2'];
            const nextIdx = (targets.indexOf(activeTarget) + 1) % targets.length;
            onSelectTarget(targets[nextIdx]);
          }}
          className="flex items-center justify-between px-space-xs py-space-2xs rounded bg-[#e9e8e5] cursor-pointer hover:bg-[#e3e2df] transition-colors"
          title="Click to toggle protocol target"
        >
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-[#44474a]">ACTIVE TARGET</span>
            <span className="font-body-sm text-body-sm font-semibold text-[#1b1c1a] truncate max-w-[120px]">
              {activeTarget}
            </span>
          </div>
          <span className="material-symbols-outlined text-base text-[#44474a]">unfold_more</span>
        </div>

        {/* Auditor Profile */}
        <div 
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-space-xs pt-space-xs border-t border-[#e9e8e5] cursor-pointer hover:bg-[#efeeeb] p-1.5 rounded-lg transition-colors"
          title="Manage Auditor Profile & Workspace"
        >
          {currentUser?.avatar ? (
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#c5c6ca]"
              src={currentUser.avatar}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#37675d] text-[#ffffff] font-semibold text-xs flex items-center justify-center border border-[#c5c6ca] shrink-0 select-none">
              {getUserInitials(currentUser?.name, currentUser?.email)}
            </div>
          )}
          <div className="flex flex-col truncate">
            <span className="font-body-sm text-body-sm font-medium text-[#1b1c1a] truncate">
              {currentUser?.name || AuthService.deriveNameFromEmail(currentUser?.email || '')}
            </span>
            <span className="font-code-sm text-code-sm text-[#44474a] truncate">
              {currentUser?.email || 'No active account'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
