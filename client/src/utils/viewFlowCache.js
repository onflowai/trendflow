const CACHE_PREFIX = 'tf_view_flow_cache';
const DEFAULT_TTL_MS = 1000 * 60 * 10; // 10 minutes

const canUseStorage = () => {
  return typeof window !== 'undefined' && window.sessionStorage;
};

export const buildViewFlowCacheKey = (params = {}) => {
  const normalizedParams = new URLSearchParams(params);
  normalizedParams.sort();
  return `${CACHE_PREFIX}:${normalizedParams.toString()}`;
};

export const getCachedViewFlow = (key) => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (!cached?.expiresAt || Date.now() > cached.expiresAt) {
      window.sessionStorage.removeItem(key);
      return null;
    }
    return cached.data || null;
  } catch (error) {
    console.error('Failed reading ViewFlow cache:', error);
    return null;
  }
};

export const setCachedViewFlow = (key, data, ttlMs = DEFAULT_TTL_MS) => {
  if (!canUseStorage()) return;
  try {
    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        data,
        expiresAt: Date.now() + ttlMs,
      })
    );
  } catch (error) {
    console.error('Failed setting ViewFlow cache:', error);
  }
};

export const clearViewFlowCache = () => {
  if (!canUseStorage()) return;
  Object.keys(window.sessionStorage).forEach((key) => {
    if (key.startsWith(CACHE_PREFIX)) {
      window.sessionStorage.removeItem(key);
    }
  });
};