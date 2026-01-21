import React, { useState, useEffect } from 'react';
import { Role } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MachineEntry } from './components/MachineEntry';
import { TELUGU_LABELS } from './constants';
import { db } from './services/db';

type Tab = 'dashboard' | 'm1' | 'm2' | 'm3';

const App: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    
    // Initial unsynced count
    setUnsyncedCount(db.getUnsyncedCount());

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const handleSync = async () => {
    if (syncing || !isOnline) return;
    setSyncing(true);
    await db.sync();
    setUnsyncedCount(0);
    setSyncing(false);
    alert('డేటా సింక్ చేయబడింది!');
  };

  const handleEntrySuccess = () => {
    setUnsyncedCount(db.getUnsyncedCount());
    if (role === Role.ADMIN) {
      setActiveTab('dashboard');
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-indigo-700 flex flex-col p-10 justify-center items-center text-center text-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-12 relative">
          <span className="text-4xl">🥚</span>
        </div>
        
        <h1 className="text-3xl font-black mb-12 leading-tight tracking-tighter">
          {TELUGU_LABELS.title}
        </h1>
        
        <div className="w-full space-y-4 relative z-10">
          <button 
            onClick={() => { setRole(Role.ADMIN); setActiveTab('dashboard'); }} 
            className="w-full bg-slate-900 py-6 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-transform"
          >
            📊 {TELUGU_LABELS.adminLogin}
          </button>
          <button 
            onClick={() => { setRole(Role.STAFF); setActiveTab('m1'); }} 
            className="w-full bg-white text-indigo-700 py-6 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-transform"
          >
            ⚙️ {TELUGU_LABELS.staffLogin}
          </button>
        </div>
        
        <p className="mt-20 text-[10px] font-bold opacity-40 uppercase tracking-[0.4em]">v1.0 Professional</p>
      </div>
    );
  }

  const NavItem = ({ id, label, icon }: { id: Tab, label: string, icon: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${activeTab === id ? 'text-indigo-700' : 'text-slate-400'}`}
    >
      <span className={`text-xl mb-1 ${activeTab === id ? 'scale-125' : 'scale-100'} transition-transform`}>{icon}</span>
      <span className={`text-[8px] font-black uppercase tracking-tighter ${activeTab === id ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
      {activeTab === id && <div className="w-1 h-1 bg-indigo-700 rounded-full mt-1 animate-ping"></div>}
    </button>
  );

  return (
    <Layout 
      isOnline={isOnline} 
      activeTab={activeTab} 
      onLogout={() => setRole(null)}
      bottomNav={
        <>
          {role === Role.ADMIN && <NavItem id="dashboard" label="డాష్‌బోర్డ్" icon="📊" />}
          <NavItem id="m1" label="M-1" icon="⚙️" />
          <NavItem id="m2" label="M-2" icon="⚙️" />
          <NavItem id="m3" label="M-3" icon="⚡" />
        </>
      }
    >
      {activeTab === 'dashboard' ? (
        <Dashboard />
      ) : (
        <MachineEntry 
          machineId={parseInt(activeTab.replace('m', ''))} 
          onSuccess={handleEntrySuccess} 
        />
      )}

      {unsyncedCount > 0 && isOnline && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="bg-amber-500 text-white px-6 py-3 rounded-full text-[10px] font-black shadow-2xl shadow-amber-200 uppercase tracking-widest flex items-center gap-2 animate-bounce"
          >
            {syncing ? '⌛ Syncing...' : `🔄 Sync ${unsyncedCount} Logs`}
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
