import React from 'react';
import { TELUGU_LABELS } from '../constants';

interface Props {
  children: React.ReactNode;
  onLogout: () => void;
  isOnline: boolean;
  activeTab: string;
  bottomNav?: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children, onLogout, isOnline, activeTab, bottomNav }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-100 flex flex-col shadow-2xl relative">
      <header className="bg-indigo-700 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xs font-black uppercase tracking-tighter opacity-80">{TELUGU_LABELS.title}</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-[9px] font-bold uppercase">{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>
        </div>
        <button onClick={onLogout} className="text-[10px] font-black bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 uppercase tracking-widest active:bg-white/20">
          {TELUGU_LABELS.logout}
        </button>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-y-auto no-scrollbar">
        {children}
      </main>

      {bottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-200 p-2 flex justify-around z-50 shadow-lg">
          {bottomNav}
        </nav>
      )}
    </div>
  );
};
