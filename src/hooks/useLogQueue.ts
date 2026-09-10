// src/hooks/use-log-queue.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { FieldLog, CreateLogInput } from "@/types/field-logs";
import { loadAllLogs, saveAllLogs, seedIfEmpty } from "@/storage/log-store";
import { generateMockHistory } from "@/data/mock-data";
import { submitLogToServer } from "@/services/mock-api";

type LoadState = "loading" | "ready";

export const useLogQueue = (isOnline: boolean) => {
  const [logs, setLogs] = useState<FieldLog[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  // Prevents two flushes running at the same time.
  const isFlushing = useRef(false);

  // ---- load or seed on first mount ----
  useEffect(() => {
    (async () => {
      const seeded = await seedIfEmpty(generateMockHistory(100));
      setLogs(seeded);
      setLoadState("ready");
    })();
  }, []);

  // ---- helper: update state AND storage together, always ----
  const persist = async (updatedLogs: FieldLog[]) => {
    setLogs(updatedLogs);
    await saveAllLogs(updatedLogs);
  };

  // ---- add a new log optimistically ----
  const addLog = async (input: CreateLogInput) => {
    const newLog: FieldLog = {
      id: uuid(),
      customerName: input.customerName,
      notes: input.notes,
      imageUri: input.imageUri,
      timestamp: Date.now(),
      status: "pending",
      syncAttempts: 0,
    };
    await persist([newLog, ...logs]);

    if(isOnline){
        flushQueue();
    }
  };

  // ---- send every pending/failed log to the server, oldest first ----
  const flushQueue = useCallback(async () => {
    if (isFlushing.current) return; // already running, don't start another
    if (!isOnline) return;

    isFlushing.current = true;

    // Re-read from storage instead of trusting React state, in case
    // addLog() fired something new while we were mid-flush.
    let currentLogs = await loadAllLogs();

    const queue = currentLogs
      .filter((l) => l.status === "pending" || l.status === "failed")
      .sort((a, b) => a.timestamp - b.timestamp); // oldest first

    for (const item of queue) {
      // mark as syncing so UI updates immediately
      currentLogs = currentLogs.map((l) =>
        l.id === item.id ? { ...l, status: "syncing" } : l
      );
      await persist(currentLogs);

      try {
        await submitLogToServer(item);
        currentLogs = currentLogs.map((l) =>
          l.id === item.id ? { ...l, status: "synced" } : l
        );
      } catch {
        currentLogs = currentLogs.map((l) =>
          l.id === item.id ? { ...l, status: "failed" } : l
        );
      }
      await persist(currentLogs);
    }

    isFlushing.current = false;
  }, [isOnline, logs]);

    // ---- auto-flush whenever we go from offline -> online ----
    const wasOnline = useRef(isOnline);
  useEffect(() => {
    if (!wasOnline.current && isOnline) {
      flushQueue();
    }
    wasOnline.current = isOnline;
  }, [isOnline, flushQueue]);

  // ---- manual retry button calls this ----
  const retryLog = async (id: string) => {
    const updated = logs.map((l) =>
      l.id === id ? { ...l, status: "pending" as const } : l
    );
    await persist(updated);
    flushQueue();
  };

  return { logs, loadState, addLog, retryLog };
};