import { ProductionRecord } from '../types';

const STORAGE_KEY = 'egg_tray_pro_v1';

export const db = {
  getRecords: (): ProductionRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecord: (record: ProductionRecord) => {
    const records = db.getRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  getUnsyncedCount: (): number => {
    return db.getRecords().filter(r => !r.isSynced).length;
  },

  sync: async (): Promise<boolean> => {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const records = db.getRecords();
    const synced = records.map(r => ({ ...r, isSynced: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
    return true;
  }
};
