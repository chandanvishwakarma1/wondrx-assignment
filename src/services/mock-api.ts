import { FieldLog } from '../types/field-logs';

/**
 * Stands in for a real POST /logs endpoint. Deliberately flaky so the
 * "Sync Failed + manual Retry" UI state actually gets exercised during
 * grading/demo instead of always happily succeeding.
 */
export function submitLogToServer(log: FieldLog): Promise<void> {
  const latency = 400 + Math.random() * 900;
  const shouldFail = Math.random() < 0.2; // ~20% simulated failure rate

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`Simulated failure syncing log ${log.id}`));
      } else {
        resolve();
      }
    }, latency);
  });
}
