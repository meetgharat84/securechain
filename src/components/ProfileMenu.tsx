import React, { useRef, useEffect } from 'react';
import type { AppScreen } from '../types';
import { AVATAR_URL } from '../data/mockData';
import { AuthService } from '../services/authService';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen, urlPath?: string) => void;
  onOpenCommandPalette: () => void;
  userName?: string;
  userEmail?: string;
  workspaceName?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCommandPalette,
  userName = 'Lead Protocol Auditor',
  userEmail = 'sec@securechain.ai',
  workspaceName = 'Treasury Protocols',
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 w-64 bg-[#ffffff] border border-[#e9e8e5] rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn text-[#1b1c1a] select-none"
    >
      {/* User Header */}
      <div className="p-space-md border-b border-[#e9e8e5] bg-[#f4f3f0] space-y-1">
        <div className="flex items-center gap-2">
          <img
            src={AVATAR_URL}
            alt="Profile Avatar"
            className="w-9 h-9 rounded-full object-cover border border-[#c5c6ca]"
          />
          <div className="flex flex-col truncate">
            <span className="font-headline-sm text-xs font-semibold text-[#1b1c1a] truncate">
              {userName}
            </span>
            <span className="font-code-sm text-[11px] text-[#75777a] truncate">
              {userEmail}
            </span>
          </div>
        </div>
        <div className="pt-1 flex items-center justify-between">
          <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#75777a]">Workspace</span>
          <span className="font-mono text-[10px] font-semibold text-[#37675d] bg-[#baede0]/40 px-1.5 py-0.5 rounded">
            {workspaceName}
          </span>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-1 text-xs font-medium divide-y divide-[#f4f3f0]">
        <div className="py-1">
          <button
            onClick={() => {
              onClose();
              onNavigate('profile');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#f4f3f0] text-[#1b1c1a] text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#44474a]">person</span>
            <span>Profile</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate('profile');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#f4f3f0] text-[#1b1c1a] text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#44474a]">corporate_fare</span>
            <span>Workspace Settings</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate('settings');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#f4f3f0] text-[#1b1c1a] text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#44474a]">tune</span>
            <span>Analysis Preferences</span>
          </button>
        </div>

        <div className="py-1">
          <button
            onClick={() => {
              onClose();
              onOpenCommandPalette();
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#f4f3f0] text-[#1b1c1a] text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-base text-[#44474a]">keyboard</span>
              <span>Keyboard Shortcuts</span>
            </div>
            <kbd className="px-1 py-0.5 rounded bg-[#efeeeb] font-mono text-[9px] text-[#75777a]">⌘K</kbd>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate('methodology');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#f4f3f0] text-[#1b1c1a] text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#44474a]">menu_book</span>
            <span>Documentation</span>
          </button>
        </div>

        <div className="pt-1">
          <button
            onClick={() => {
              onClose();
              AuthService.logout();
              onNavigate('login', '/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#ffdad6]/40 text-[#ba1a1a] text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#ba1a1a]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
