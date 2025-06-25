/**
 * helper function to keep every trend, but only show
 * its techIconUrl & trendTech the first time they appear.
 */
export const dedupeTrendsKeepAll = (trends) => {
  const seenIconUrls = new Set();
  return trends.map((trend) => {
    const obj = trend.toObject ? trend.toObject() : { ...trend };
    if (!seenIconUrls.has(obj.techIconUrl)) {
      seenIconUrls.add(obj.techIconUrl);
      return obj;
    }

    // duplicate techIconUrl
    delete obj.techIconUrl;
    delete obj.trendTech;
    return obj;
  });
};
