import { safeParseJson } from './validation';

export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return safeParseJson<T>(item, fallback);
  } catch (err) {
    console.warn(`[Storage] Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
}

export function setToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[Storage] Failed to write ${key} to localStorage:`, err);
    return false;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove ${key} from localStorage:`, err);
  }
}
