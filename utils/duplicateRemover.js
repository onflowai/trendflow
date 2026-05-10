/**
 * helper function to keep every trend, but only show
 * its primary trendTechs entry the first time it appears.
 */
export const dedupeTrendsKeepAll = (trends) => {
  const seenIconUrls = new Set();
  return trends.map((trend) => {
    const obj = trend.toObject ? trend.toObject() : { ...trend };
    const primaryIconUrl = obj.trendTechs?.[0]?.techIconUrl;
    if (!seenIconUrls.has(primaryIconUrl)) {
      seenIconUrls.add(primaryIconUrl);
      return obj;
    }

    // duplicate primary techIconUrl — strip the trendTechs array so the UI shows
    // no tech icon for this repeated tech group
    delete obj.trendTechs;
    return obj;
  });
};
