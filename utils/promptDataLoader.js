import PromptData from '../models/promptDataModel.js';

const CACHE_TTL_MS = 60 * 1000; //cache prompts for one minute

let cachedPromptData = null;
let cacheExpiresAt = 0;

const replacePromptVariables = (prompt, replacements) => {
  let result = String(prompt || '');

  for (const [variable, value] of Object.entries(replacements)) {
    result = result
      .split(`\${${variable}}`)
      .join(String(value ?? '')); //replacing every matching placeholder
  }

  return result;
};

export const loadPromptData = async ({ forceRefresh = false } = {}) => {
  const now = Date.now();

  if (
    !forceRefresh &&
    cachedPromptData &&
    now < cacheExpiresAt
  ) {
    return cachedPromptData; //avoid repeated Mongo queries
  }

  const document = await PromptData.findOne({ key: 'default' })
    .lean()
    .exec();

  if (!document) {
    throw new Error(
      'Prompt data is not seeded. Run node scripts/seedPrompts.js.'
    );
  }

  const trend = {
    ...document.trend,

    USER_ROLE_POST: replacePromptVariables(
      document.trend.USER_ROLE_POST,
      {
        MAX_TOKENS_POST: document.trend.MAX_TOKENS_POST,
        MAX_TOKENS_DESC: document.trend.MAX_TOKENS_DESC,
        MAX_TOKENS_USE: document.trend.MAX_TOKENS_USE,
      }
    ),
  };

  cachedPromptData = Object.freeze({
    trend: Object.freeze(trend),
    skill: Object.freeze({ ...document.skill }),
  });

  cacheExpiresAt = now + CACHE_TTL_MS;

  return cachedPromptData;
};

export const loadTrendPromptData = async (options) => {
  const promptData = await loadPromptData(options);

  return promptData.trend;
};

export const loadSkillPromptData = async (options) => {
  const promptData = await loadPromptData(options);

  return promptData.skill;
};

export const clearPromptDataCache = () => {
  cachedPromptData = null;
  cacheExpiresAt = 0;
};