/**
 * runs an openai api operation and retries only temporary failures
 *
 * retry examples:
 * - 429: OpenAI rate limit
 * - 500/502/503/504: temporary OpenAI server failure
 * - ECONNRESET/ETIMEDOUT: temporary network failure
 *
 * permanent failures such as invalid authentication, invalid request data,
 * or exhausted retries are thrown back to the generator unchanged
 *
 * This helper does not convert errors into application HTTP errors.
 * The calling generator decides how the final failure should be logged
 * and which custom application error should be thrown.
 *
 * retries = 4 means one initial attempt plus four retry attempts.
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

  // Retry-After can be a number of seconds
  if (/^\d+(?:\.\d+)?$/.test(rawValue)) {
    return Math.round(Number(rawValue) * 1000);
  }

  // OpenAI headers can use values such as 1m5s or 0.5s
  const durationMatch = rawValue.match(
    /^(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?$/
  );

  if (
    durationMatch &&
    (durationMatch[1] || durationMatch[2])
  ) {
    const minutes = Number.parseInt(
      durationMatch[1] || '0',
      10
    );

    const seconds = Number.parseFloat(
      durationMatch[2] || '0'
    );

    return Math.round(
      (minutes * 60 + seconds) * 1000
    );
  }

  // Retry-After may also be an HTTP date
  const retryDate = Date.parse(rawValue);

  if (!Number.isNaN(retryDate)) {
    return Math.max(0, retryDate - Date.now());
  }

  return 0;
};

const getRetryDelay = (
  error,
  attempt,
  baseMs,
  maxMs
) => {
  const headers = error?.response?.headers || {};

  const resetDelay =
    parseResetHeader(
      headers['x-ratelimit-reset-requests']
    ) ||
    parseResetHeader(
      headers['x-ratelimit-reset-tokens']
    ) ||
    parseResetHeader(headers['retry-after']);

  if (resetDelay > 0) {
    return Math.min(resetDelay, maxMs);
  }

  const exponentialDelay = baseMs * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 250);

  return Math.min(
    exponentialDelay + jitter,
    maxMs
  );
};

export const withOpenAIRetries = async (
  operation,
  {
    retries = 4,
    baseMs = 600,
    maxMs = 10000,
    operationName = 'openai-operation',
    onRetry = null,
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
        throw error; // Preserve the original OpenAI error
      }

      const delay = getRetryDelay(
        error,
        attempt,
        baseMs,
        maxMs
      );

      if (typeof onRetry === 'function') {
        onRetry({
          operationName,
          retryNumber: attempt + 1,
          maximumRetries: retries,
          delayMs: delay,
          status: status || null,
          code: code || null,
          requestId:
            error?.response?.headers?.['x-request-id'] ||
            null,
        });
      }

      await sleep(delay);

      attempt += 1;
    }
  }
};