import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { db } from '../services/db';
import { MACHINES, TELUGU_LABELS } from '../constants';
import { getAIInsights } from '../services/gemini';
import { ProductionRecord } from '../types';

export const Dashboard: React.FC = () => {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [aiText, setAiText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setRecords(db.getRecords());
  }, []);

  const machineStats = MACHINES.map(m => {
    const total = records
      .filter(r => r.machineId === m.id)
      .reduce((sum, r) => sum + r.hourlyProduction.reduce((hSum, h) => hSum + h.count, 0), 0);
    return { name: `M${m.id}`, total, color: m.color };
  });

  const grandTotal = machineStats.reduce((a, b) => a + b.total, 0);

  const fetchAI = async () => {
    setLoadingAi(true);
    const result = await getAIInsights(records);
    setAiText(result);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{TELUGU_LABELS.totalTrays}</p>
        <p className="text-5xl font-black">{grandTotal.toLocaleString()}</p>
        
        <div className="mt-8 flex gap-3">
          {machineStats.map(s => (
            <div key={s.name} className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase">{s.name}</p>
              <p className="text-lg font-black">{s.total}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 h-64">
        <h3 className="text-[11px] font-black uppercase text-slate-400 mb-4">{TELUGU_LABELS.hourlyTitle}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={machineStats}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
            <YAxis hide />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={35}>
              {machineStats.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[11px] font-black uppercase text-amber-800 tracking-wider">💡 {TELUGU_LABELS.aiAdvice}</h3>
          {!aiText && (
            <button 
              onClick={fetchAI} 
              disabled={loadingAi}
              className="bg-amber-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loadingAi ? '...' : 'సలహా అడగండి'}
            </button>
          )}
        </div>
        <p className="text-sm font-semibold text-amber-900 leading-relaxed italic">
          {aiText ? `"${aiText}"` : 'మీ ప్రొడక్షన్ రిపోర్ట్స్ విశ్లేషించడానికి బటన్ క్లిక్ చేయండి.'}
        </p>
      </div>

      <div className="space-y-3 pb-4">
        <h3 className="text-[11px] font-black uppercase text-slate-400 px-2 tracking-widest">ఇటీవలి రికార్డులు</h3>
        {records.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs italic font-medium">{TELUGU_LABELS.noData}</div>
        ) : (
          records.slice(-5).reverse().map(r => (
            <div key={r.id} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-xs">M{r.machineId}</div>
                <div>
                  <p className="text-xs font-black text-slate-800">{r.shift.split('(')[0]}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{r.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">{r.hourlyProduction.reduce((a, b) => a + b.count, 0)}</p>
                {r.breakdown.durationMinutes > 0 && <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">⚠️ {r.breakdown.durationMinutes}m BD</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
