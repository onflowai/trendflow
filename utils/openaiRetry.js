/**
 * retries temporary upstream failures such as rate limits OpenAI server errors and network timeouts
 * replaces the generator-specific retry function so trend and skill generation can eventually share it
 */
const RETRYABLE_STATUSES = new Set([
  429,
  500,
  502,
  503,
  504,
]);

const RETRYABLE_NETWORK_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNABORTED',
  'EAI_AGAIN',
]);

const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const parseResetHeader = (value) => {
  if (!value) return 0;

  const rawValue = String(value).trim();

  if (/^\d+$/.test(rawValue)) {
    return Number.parseInt(rawValue, 10) * 1000;
  }

  const match = rawValue.match(/(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?/);

  if (!match) return 0;

  const minutes = Number.parseInt(match[1] || '0', 10);
  const seconds = Number.parseFloat(match[2] || '0');

  return Math.round((minutes * 60 + seconds) * 1000);
};

const getRetryDelay = (error, attempt, baseMs, maxMs) => {
  const headers = error?.response?.headers || {};

  const resetDelay =
    parseResetHeader(headers['x-ratelimit-reset-requests']) ||
    parseResetHeader(headers['x-ratelimit-reset-tokens']) ||
    parseResetHeader(headers['retry-after']);

  if (resetDelay > 0) {
    return Math.min(resetDelay, maxMs);
  }

  const exponentialDelay = baseMs * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 250);

  return Math.min(exponentialDelay + jitter, maxMs);
};

export const withOpenAIRetries = async (
  operation,
  {
    retries = 4,
    baseMs = 600,
    maxMs = 10000,
  } = {}
) => {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      const status = error?.response?.status;
      const code = error?.code;

      const retryable =
        RETRYABLE_STATUSES.has(status) ||
        RETRYABLE_NETWORK_CODES.has(code);

      if (!retryable || attempt >= retries) {
        throw error;
      }

      const delay = getRetryDelay(
        error,
        attempt,
        baseMs,
        maxMs
      );

      await sleep(delay);
      attempt += 1;
    }
  }
};