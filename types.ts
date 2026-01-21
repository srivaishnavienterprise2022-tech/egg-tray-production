export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum Shift {
  SHIFT_1 = 'Shift 1 (8am-4pm)',
  SHIFT_2 = 'Shift 2 (4pm-12am)',
  SHIFT_3 = 'Shift 3 (12am-8am)'
}

export interface HourlyData {
  hour: number;
  count: number;
}

export interface BreakdownInfo {
  durationMinutes: number;
  reason: string;
}

export interface ProductionRecord {
  id: string;
  machineId: number;
  machineName: string;
  machineType: string;
  date: string;
  shift: Shift;
  hourlyProduction: HourlyData[];
  breakdown: BreakdownInfo;
  isSynced: boolean;
  createdAt: number;
}
