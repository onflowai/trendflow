import { OpenAIApi, Configuration } from 'openai'; //openai's SDK
import {
  MAX_TOKENS_POST,
  MAX_TOKENS_DESC,
  MAX_TOKENS_USE,
  SYSTEM_ROLE_POST,
  USER_ROLE_POST,
  DESC_SYSTEM_ROLE, // kept for structure (not used in single-call) //HERE
  USE_SYSTEM_ROLE,  // kept for structure (not used in single-call) //HERE
  RESPONSE_USER_DESC, // kept for structure //HERE
  RESPONSE_USER_USE,  // kept for structure //HERE
  TREND_URL_BUTTON,
} from '../utils/openaiPromptData.js';
import * as dotenv from 'dotenv';

/**
 * Trend post generator will take values: trend, trendCategory, trendTech and generate Getting Started Guide post for the trend using Structured Chat.
 * Then it will take that generated post feed it back to it self generate a trendDescription 'trendDesc' which will be short explanation of the
 * trend & 'trendUse' best uses.
 * openai:  gpt-3.5-turbo-instruct: instruct model is much more terse and concise, it just does what it is instructed to do.
 * @param {*} trend
 * @returns
 */
dotenv.config();

// Async function to generate blog content using OpenAI (single-call version) //HERE
export const generatePostContent = async (trend, trendCategory, trendTech) => {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config); //new instance of openai

  let trendPost = '';
  let trendDesc = '';
  let trendUse = '';

  // Token budget keeps your existing knobs relevant //HERE
  const TOTAL_MAX = Math.max(
    256,
    Math.min(
      (MAX_TOKENS_POST || 0) + (MAX_TOKENS_DESC || 0) + (MAX_TOKENS_USE || 0),
      4000 // reasonable cap for older SDK usage
    )
  );

  // Compose one prompt that asks for all three outputs in strict JSON //HERE
  const system = `
${SYSTEM_ROLE_POST}

You must return valid JSON with the following exact shape:
{
  "trendPost": string,   // a startup/how-to tutorial with a brief "Getting Started" section and a tiny CTA at the end
  "trendDesc": string,   // 1–2 sentence plain-English description
  "trendUse":  string    // short paragraph describing best uses
}
No markdown, no backticks, no commentary — JSON only.`;

  const user = `
${USER_ROLE_POST}
Write it about the "${trend}" in the technology category of "${trendCategory}", specifically focusing on "${trendTech}" technology. ${TREND_URL_BUTTON}
Keep it concise and practical.`;

  try {
    const response = await withRetries(async () =>
      openai.createChatCompletion({
        // Use a current, inexpensive model; keepable with old SDK //HERE
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: TOTAL_MAX,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      })
    );

    const content = response?.data?.choices?.[0]?.message?.content ?? '';

    // Expect JSON. Parse strictly; fallback to extracting the first {...}. //HERE
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/{[\s\S]*}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Model did not return valid JSON.');
      }
    }

    trendPost = typeof parsed.trendPost === 'string' ? parsed.trendPost : '';
    trendDesc = typeof parsed.trendDesc === 'string' ? parsed.trendDesc : '';
    trendUse = typeof parsed.trendUse === 'string' ? parsed.trendUse : '';

  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.error?.message || error?.message;
    console.error('Error generating startup/how-to blog post (single-call):', status, msg); //HERE
    // Preserve your original error throwing contract
    throw new Error('Failed to generate startup/how-to blog post');
  }

  return {
    trendPost,
    trendDesc,
    trendUse,
  };
};

// Lightweight retry/backoff specifically for 429s (rate/credit hiccups) //HERE
async function withRetries(fn, { retries = 4, baseMs = 600 } = {}) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 429 || attempt >= retries) throw err;

      // Try to honor ratelimit reset headers if present
      const h = err?.response?.headers || {};
      const waitMs = parseReset(h['x-ratelimit-reset-requests']) ||
                     parseReset(h['x-ratelimit-reset-tokens']) ||
                     Math.min(8000, baseMs * 2 ** attempt);
      await new Promise(r => setTimeout(r, waitMs));
      attempt++;
    }
  }
}

function parseReset(v) {
  if (!v) return 0;
  // Accept "3s" or "1m5s" formats
  const m = String(v).match(/(?:(\d+)m)?(?:(\d+)s)?/);
  if (!m) return 0;
  const minutes = parseInt(m[1] || '0', 10);
  const seconds = parseInt(m[2] || '0', 10);
  return (minutes * 60 + seconds) * 1000;
}

//TEST
// generatePostContent('Reactjs', 'Frontend Framework', 'Javascript');