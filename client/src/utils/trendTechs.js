/**
 * trendTechs normalization directly from mongo to prevent issue with trendTech.split, etc
 * const normalizedTrendTechs = normalizeTrendTechs(trendTechs);
 * const primaryTrendTech = getPrimaryTrendTech(trendTechs);
 * @param {*} trendTechs 
 * @returns 
 */
export const normalizeTrendTechs = (trendTechs) => {
  if (!Array.isArray(trendTechs)) return [];

  return trendTechs
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      value: String(item?.value || '').trim(),
      techIconUrl: String(item?.techIconUrl || '').trim(),
    }))
    .filter((item) => item.value);
};

export const getPrimaryTrendTech = (trendTechs) => {
  const normalized = normalizeTrendTechs(trendTechs);
  return normalized[0] || { value: '', techIconUrl: '' };
};