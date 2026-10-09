import { useSyncExternalStore, useMemo } from 'react';
import { ModelConfig } from '@/types/model';

const STORAGE_KEY = 'tokensaver_custom_models_v1';

export function getCustomModels(): ModelConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((m) => ({
        ...m,
        isCustom: true,
      }));
    }
  } catch (err) {
    console.error('Failed to read custom models from localStorage:', err);
  }
  return [];
}

export function saveCustomModel(model: ModelConfig): ModelConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCustomModels();
    const existingIndex = current.findIndex((m) => m.id === model.id);
    let updated: ModelConfig[];
    const sanitizedModel: ModelConfig = {
      ...model,
      isCustom: true,
      id: model.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = sanitizedModel;
    } else {
      updated = [sanitizedModel, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tokensaver_models_changed'));
    return updated;
  } catch (err) {
    console.error('Failed to save custom model to localStorage:', err);
    return getCustomModels();
  }
}

export function deleteCustomModel(id: string): ModelConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getCustomModels();
    const filtered = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('tokensaver_models_changed'));
    return filtered;
  } catch (err) {
    console.error('Failed to delete custom model from localStorage:', err);
    return getCustomModels();
  }
}

export function clearAllCustomModels(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('tokensaver_models_changed'));
  } catch (err) {
    console.error('Failed to clear custom models:', err);
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('tokensaver_models_changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('tokensaver_models_changed', callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem(STORAGE_KEY) || '[]';
}

function getServerSnapshot(): string {
  return '[]';
}

export function useCustomModels(): ModelConfig[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((m: ModelConfig) => ({
          ...m,
          isCustom: true,
        }));
      }
    } catch {
      // ignore
    }
    return [];
  }, [raw]);
}

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
