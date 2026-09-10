export type SyncStatus = 'pending' | 'syncing' | 'failed' | 'synced';

export interface FieldLog {
  id: string;
  customerName: string;
  notes: string;
  timestamp: number; // epoch ms, set at creation time (not at sync time)
  imageUri?: string; // mock picker result, optional
  status: SyncStatus;
  syncAttempts: number;
}

export interface CreateLogInput {
  customerName: string;
  notes: string;
  imageUri?: string;
}
