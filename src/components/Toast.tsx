import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-[#191c1f] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs font-mono max-w-md">
        <span className="w-2 h-2 rounded-full bg-[#86d6bb] shrink-0"></span>
        <span className="flex-1 leading-snug">{message}</span>
        <button
          onClick={onClose}
          className="text-[#828488] hover:text-white transition-colors p-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};
