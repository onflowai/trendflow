import bundledTechFallbackIcon from '../assets/images/fallback-tech.svg';
import bundledCategoryFallbackIcon from '../assets/images/fallback-cat.svg';

/**
 * shared fallback utility tries CDN / Mongo-provided icon if that fails tries public/static fallback: /assets/fallback-tech.svg
 * if that fails tries bundled local fallback imported from src/assets/images/fallback-tech.svg and src/assets/images/fallback-cat.svg 
 */
export const TECH_FALLBACK_ICON = '/assets/fallback-tech.svg';
export const CATEGORY_FALLBACK_ICON = '/assets/cat/fallback-cat.svg';
export const TECH_BUNDLED_FALLBACK_ICON = bundledTechFallbackIcon;
export const CATEGORY_BUNDLED_FALLBACK_ICON = bundledCategoryFallbackIcon;

export const getPublicFallbackByName = (dropdownName) => {
  if (dropdownName === 'trendCategory') return CATEGORY_FALLBACK_ICON;
  if (dropdownName === 'trendTech') return TECH_FALLBACK_ICON;
  if (dropdownName === 'trendTechs_display') return TECH_FALLBACK_ICON;

  return TECH_FALLBACK_ICON;
};

export const getBundledFallbackByName = (dropdownName) => {
  if (dropdownName === 'trendCategory') return CATEGORY_BUNDLED_FALLBACK_ICON;
  if (dropdownName === 'trendTech') return TECH_BUNDLED_FALLBACK_ICON;
  if (dropdownName === 'trendTechs_display') return TECH_BUNDLED_FALLBACK_ICON;

  return TECH_BUNDLED_FALLBACK_ICON;
};

export const ensureAssetPath = (fileName) => {
  const value = String(fileName || '').trim();

  if (!value) return '';
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value;
  }  // already a full URL or data/blob URL

  // already a public asset path
  if (value.startsWith('/assets/')) return value;

  // handles values like assets/react.svg
  if (value.startsWith('assets/')) return `/${value}`;

  return `/assets/${value}`;
};

export const getTechDisplayImage = (option) => {
  const fullImageUrl = String(option?.fullImageUrl || '').trim();
  if (fullImageUrl) return fullImageUrl;

  const image = String(option?.image || '').trim();
  if (image) return image;

  const techIconUrl = String(option?.techIconUrl || '').trim();
  if (techIconUrl) {
    return techIconUrl.endsWith('.svg') ? techIconUrl : `${techIconUrl}.svg`;
  }

  const fileName = String(option?.fileName || '').trim();
  if (fileName) return ensureAssetPath(fileName);

  return TECH_FALLBACK_ICON;
};

export const getCategoryDisplayImage = (option) => {
  const fullImageUrl = String(option?.fullImageUrl || '').trim();
  if (fullImageUrl) return fullImageUrl;

  const image = String(option?.image || option?.cateIconUrl || '').trim();
  if (image) return image;

  const fileName = String(option?.fileName || '').trim();
  if (fileName) {
    const normalized = ensureAssetPath(fileName);

    // if category fileName is just "frontend.svg", force it into /assets/cat/
    if (!normalized.includes('/cat/') && !fileName.startsWith('/assets/')) {
      return `/assets/cat/${fileName}`;
    }

    return normalized;
  }

  return CATEGORY_FALLBACK_ICON;
};

export const handleIconError = ({
  event,
  publicFallback,
  bundledFallback,
}) => {
  const img = event.currentTarget;
  const currentStage = Number(img.dataset.fallbackStage || 0);

  // Stage 1: try the public/static fallback path first.
  if (currentStage < 1 && publicFallback) {
    img.dataset.fallbackStage = '1';
    img.src = publicFallback;
    return;
  }

  // Stage 2: try the Vite-bundled fallback from src/assets/images.
  if (currentStage < 2 && bundledFallback) {
    img.dataset.fallbackStage = '2';
    img.src = bundledFallback;
    return;
  }

  // Prevent infinite onError loops.
  img.onerror = null;
};