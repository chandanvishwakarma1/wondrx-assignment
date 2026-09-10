import { v4 as uuid } from 'uuid';
import { FieldLog } from '../types/field-logs';

const NAMES = [
  'Rohan Mehta', 'Priya Nair', 'Arjun Kapoor', 'Sneha Iyer', 'Vikram Rao',
  'Ananya Desai', 'Karan Malhotra', 'Divya Menon', 'Rahul Verma', 'Isha Kulkarni',
];

const NOTE_TEMPLATES = [
  'Meter reading confirmed, no issues.',
  'Customer requested callback next week.',
  'Basement access was locked, rescheduled.',
  'Signal dropped mid-visit, notes may be incomplete.',
  'Equipment check passed, photo attached.',
  'Customer unavailable, left notice.',
];

export function generateMockHistory(count: number): FieldLog[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const hoursAgo = count - i;
    return {
      id: uuid(),
      customerName: NAMES[i % NAMES.length],
      notes: NOTE_TEMPLATES[i % NOTE_TEMPLATES.length],
      timestamp: now - hoursAgo * 60 * 60 * 1000,
      status: 'synced' as const,
      syncAttempts: 1,
    };
  });
}
