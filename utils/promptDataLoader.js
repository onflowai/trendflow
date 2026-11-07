import PromptData from '../models/promptDataModel.js';

const CACHE_TTL_MS = 60 * 1000; //cache prompts for one minute

let cachedPromptData = null;
let cacheExpiresAt = 0;

export const loadPromptData = async ({
  forceRefresh = false,
} = {}) => {
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

    USER_ROLE_POST: String(
      document.trend.USER_ROLE_POST || ''
    ).replace(
      '${MAX_TOKENS_POST}',
      String(document.trend.MAX_TOKENS_POST || 0)
    ), //
  };

  cachedPromptData = Object.freeze({
    trend: Object.freeze(trend),

    skill: Object.freeze({
      ...document.skill,
    }), // skill values stay exactly as stored
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