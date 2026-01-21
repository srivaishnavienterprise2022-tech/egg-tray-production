import React, { useState } from 'react';
import { Shift, ProductionRecord } from '../types';
import { TELUGU_LABELS, MACHINES } from '../constants';
import { db } from '../services/db';

interface Props {
  machineId: number;
  onSuccess: () => void;
}

export const MachineEntry: React.FC<Props> = ({ machineId, onSuccess }) => {
  const machine = MACHINES.find(m => m.id === machineId)!;
  const [shift, setShift] = useState<Shift>(Shift.SHIFT_1);
  const [counts, setCounts] = useState<number[]>(new Array(8).fill(0));
  const [breakdown, setBreakdown] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: ProductionRecord = {
      id: crypto.randomUUID(),
      machineId,
      machineName: machine.name,
      machineType: machine.type,
      date: new Date().toLocaleDateString('te-IN'),
      shift,
      hourlyProduction: counts.map((c, i) => ({ hour: i + 1, count: c })),
      breakdown: { durationMinutes: breakdown, reason },
      isSynced: false,
      createdAt: Date.now()
    };
    db.saveRecord(record);
    alert('డేటా విజయవంతంగా సేవ్ చేయబడింది!');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-indigo-700 p-6 rounded-[2.5rem] text-white shadow-xl">
        <h2 className="text-2xl font-black">{machine.name}</h2>
        <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em]">{machine.type} Capacity Unit</p>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">షిఫ్ట్ ఎంచుకోండి</label>
          <select 
            value={shift} 
            onChange={e => setShift(e.target.value as Shift)}
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
          >
            {Object.values(Shift).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-1">{TELUGU_LABELS.hourlyTitle}</label>
          <div className="grid grid-cols-4 gap-3">
            {counts.map((val, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[8px] font-black text-slate-400 block text-center uppercase">H{i+1}</span>
                <input 
                  type="number" 
                  value={val || ''} 
                  placeholder="0"
                  onChange={e => {
                    const newCounts = [...counts];
                    newCounts[i] = Math.max(0, parseInt(e.target.value) || 0);
                    setCounts(newCounts);
                  }}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-center text-sm font-black focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 space-y-4 shadow-sm">
        <h3 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
          <span className="text-base">⚠️</span> {TELUGU_LABELS.breakdownTitle}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <input 
              type="number" 
              placeholder="నిమి" 
              value={breakdown || ''}
              onChange={e => setBreakdown(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-white border-none rounded-2xl p-4 text-sm font-black text-rose-900 placeholder-rose-200 focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
          <div className="col-span-2">
            <input 
              type="text" 
              placeholder={TELUGU_LABELS.reason}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold text-rose-900 placeholder-rose-200 focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-indigo-700 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-all">
        {TELUGU_LABELS.save}
      </button>
    </form>
  );
};
