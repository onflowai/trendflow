/**
 * Authenticated ViewFlow limits
 */
export const DEFAULT_VISUAL_LIMIT = 72;//fallback
export const MIN_VISUAL_LIMIT = 12;
export const MAX_VISUAL_LIMIT = 100;
/**
 * Guest ViewFlow limit
 * Guest does NOT get frontend control.
 */
export const GUEST_VISUAL_LIMIT = 22; //hardcoded guest pull limit
export const GUEST_MOBILE_VISUAL_LIMIT = 32;
/**
 * Mobile ViewFlow limits
 */
export const MOBILE_VISUAL_LIMIT = 26; //mobile fallback
export const MOBILE_MIN_VISUAL_LIMIT = 10; //
export const MOBILE_MAX_VISUAL_LIMIT = 54; //mobile hard cap
/**
 * Tech edge limits
 */
export const MOBILE_TECHS_PER_TREND = 3; //limiting for mobile 
export const DESKTOP_TECHS_PER_TREND = 10; //setting large limit if in future trendTechs limit lifted

/**
 * nodes include:
 * - trend nodes
 * - category nodes
 * - tech nodes
 * edges include:
 * trend → category
 * trend → tech
 * ViewFlowUtils supports viewController with:
 * limit tech nodes per trend
 * hide weak relationship nodes
 * group category nodes
 * count how many trends connect to each tech
 * size nodes by relationship count
 * filter orphan nodes
 * @param {*} value 
 * @returns 
 */

export const isGuestRole = (role = 'guestUser') => {
  return role === 'guestUser' || !role;
};

export const getVisualLimitConfig = (
  role = 'guestUser',
  isMobileView = false
) => {
  if (isGuestRole(role) && isMobileView) {
    return {
      defaultLimit: GUEST_MOBILE_VISUAL_LIMIT,
      minLimit: GUEST_MOBILE_VISUAL_LIMIT,
      maxLimit: GUEST_MOBILE_VISUAL_LIMIT,
      canUseRequestedLimit: false,
    };
  }

  if (isGuestRole(role)) {
    return {
      defaultLimit: GUEST_VISUAL_LIMIT,
      minLimit: GUEST_VISUAL_LIMIT,
      maxLimit: GUEST_VISUAL_LIMIT,
      canUseRequestedLimit: false,
    };
  }

  if (isMobileView) {
    return {
      defaultLimit: MOBILE_VISUAL_LIMIT,
      minLimit: MOBILE_MIN_VISUAL_LIMIT,
      maxLimit: MOBILE_MAX_VISUAL_LIMIT,
      canUseRequestedLimit: true,
    };
  }

  return {
    defaultLimit: DEFAULT_VISUAL_LIMIT,
    minLimit: MIN_VISUAL_LIMIT,
    maxLimit: MAX_VISUAL_LIMIT,
    canUseRequestedLimit: true,
  };
};

export const normalizeKey = (value = '') => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
export const buildNodeId = (type, value) => {
  return `${type}:${normalizeKey(value)}`;
};
export const createEdgeId = (source, target, relation) => {
  return `${source}->${target}:${relation}`;
};
export const escapeRegex = (value = '') => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //prevents user search from becoming raw regex chaos
};
export const getSafeVisualLimit = (
  limit,
  role = 'guestUser',
  isMobileView = false
) => {
  const { defaultLimit, minLimit, maxLimit, canUseRequestedLimit } =
    getVisualLimitConfig(role, isMobileView);
  if (!canUseRequestedLimit) {
    return defaultLimit; //uestUser always gets backend hardcoded limit
  }
  const parsedLimit = Number(limit);
  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    return defaultLimit;
  }
  const requestedLimit = Math.floor(parsedLimit);
  return Math.min(Math.max(requestedLimit, minLimit), maxLimit); //clamp min/max
};
export const getViewFlowTechLimit = (isMobileView = false) => {
  return isMobileView ? MOBILE_TECHS_PER_TREND : DESKTOP_TECHS_PER_TREND;
};
export const getTrendIconUrl = (trend) => {
  const firstTech = trend.trendTechs?.[0];
  const normalizedTrend = normalizeKey(trend.trend);
  const normalizedFirstTech = normalizeKey(firstTech?.value);

  if (firstTech?.techIconUrl && normalizedTrend === normalizedFirstTech) {
    return firstTech.techIconUrl; //use first tech icon when it matches trend
  }
  if (trend.svg_url) {
    return trend.svg_url; //manual uploaded/cloud icon
  }
  if (firstTech?.techIconUrl) {
    return firstTech.techIconUrl; //fallback to first tech icon
  }
  if (trend.cateIconUrl) {
    return trend.cateIconUrl; //final useful fallback
  }
  return '/assets/fallback-tech.svg';
};

export const buildVisualQuery = ({ search, trendCategory, trendTech, status }) => {
  const queryObject = {
    isApproved: true,
  };

  if (search && String(search).trim()) {
    const safeSearch = escapeRegex(String(search).trim());
    queryObject.$or = [
      { trend: { $regex: safeSearch, $options: 'i' } },
      { trendDesc: { $regex: safeSearch, $options: 'i' } },
      { trendCategory: { $regex: safeSearch, $options: 'i' } },
      { 'trendTechs.value': { $regex: safeSearch, $options: 'i' } },
    ];
  }

  if (trendCategory && String(trendCategory).trim()) {
    queryObject.trendCategory = String(trendCategory).trim();
  }
  if (trendTech && String(trendTech).trim()) {
    queryObject['trendTechs.value'] = String(trendTech).trim();
  }
  if (status && String(status).trim()) {
    queryObject.trendStatus = String(status).trim();
  }
  return queryObject;
};

export const getPrimaryTech = (trend) => {
  return trend.trendTechs?.[0] || null;
};

export const doesPrimaryTechMatchTrend = (trend) => {
  const primaryTech = getPrimaryTech(trend);

  if (!trend?.trend || !primaryTech?.value) return false;
  return normalizeKey(trend.trend) === normalizeKey(primaryTech.value);
};

export const getCanonicalTrendNodeId = (trend) => {
  const primaryTech = getPrimaryTech(trend);

  if (doesPrimaryTechMatchTrend(trend)) {
    return buildNodeId('tech', primaryTech.value); //merge trend node into primary tech node
  }
  return buildNodeId('trend', trend.slug || trend.trend); //separate trend node when no primary match
};

export const shouldSkipPrimaryTechEdge = (trend, tech, index) => {
  if (index !== 0) return false;

  const primaryTechMatchesTrend = doesPrimaryTechMatchTrend(trend);

  if (!primaryTechMatchesTrend) return false;
  return normalizeKey(trend.trend) === normalizeKey(tech.value); //prevents self-edge
};

export const mergeNodeType = (existingType, incomingType) => {
  if (existingType === 'trend' || incomingType === 'trend') return 'trend'; //trend wins visually
  if (existingType === 'category' || incomingType === 'category') {
    return existingType;
  }
  return incomingType || existingType;
};

export const addNode = (nodeMap, node) => {
  if (!node?.id) return;

  if (nodeMap.has(node.id)) {
    const existingNode = nodeMap.get(node.id);

    nodeMap.set(node.id, {
      ...existingNode,
      ...node,
      type: mergeNodeType(existingNode.type, node.type), //trend node wins if merged with tech
      isPrimaryTech: Boolean(existingNode.isPrimaryTech || node.isPrimaryTech),
      isCanonicalTrendTech: Boolean(
        existingNode.isCanonicalTrendTech || node.isCanonicalTrendTech
      ), //marks merged trend/tech nodes
    });
    return;
  }

  nodeMap.set(node.id, node);
};

export const addEdge = (edgeMap, edge) => {
  if (!edge?.id || edgeMap.has(edge.id)) return;
  edgeMap.set(edge.id, edge);
};