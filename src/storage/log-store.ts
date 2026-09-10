import AsyncStorage from '@react-native-async-storage/async-storage';
import { FieldLog } from '../types/field-logs';

const STORAGE_KEY = 'wondrx.fieldLogs.v1';

export const loadAllLogs = async(): Promise<FieldLog[]> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    try {
        return JSON.parse(raw) as FieldLog[];
    } catch (error) {
        console.log('[LOAD Error] failed to load all logs: ', error);
        return [];
    }
}

export const saveAllLogs = async(logs: FieldLog[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export const seedIfEmpty = async(seedData: FieldLog[]) => {
    const existing = await loadAllLogs();
    if(existing.length > 0) return existing;
    await saveAllLogs(seedData)
    return seedData; 
}

export const clearAllLogs = async() => {
    await AsyncStorage.removeItem(STORAGE_KEY);
}