/**
 * safely extracts useful OpenAI diagnostics
 * used in /api
 * @param {*} error 
 * @param {*} param1 
 * @returns 
 */
export const getOpenAIErrorDetails = (
  error,
  {
    operation,
    model,
    stage,
  } = {}
) => {
  const providerError =
    error?.response?.data?.error || {};

  const headers =
    error?.response?.headers || {};

  return {
    service: 'openai',
    operation: operation || 'unknown',
    stage: stage || 'unknown',
    model: model || null,

    providerStatus:
      error?.response?.status || null,

    providerCode:
      providerError.code ||
      error?.code ||
      null,

    providerType:
      providerError.type || null,

    providerMessage:
      providerError.message ||
      error?.message ||
      'Unknown OpenAI error',

    requestId:
      headers['x-request-id'] ||
      headers['request-id'] ||
      null,

    retryAfter:
      headers['retry-after'] || null,
  };
};