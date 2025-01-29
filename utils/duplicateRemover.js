/**
 * helper function to remove duplicates from trends based on techIconUrl
 * @param {Array} trends - array of trend objects
 * @returns {Array} - array of unique trend objects
 */
export const removeDuplicateTrends = (trends) => {
  const uniqueTechIconUrls = new Set();
  const uniqueTrends = [];

  trends.forEach((trend) => {
    if (!uniqueTechIconUrls.has(trend.techIconUrl)) {
      uniqueTechIconUrls.add(trend.techIconUrl);
      uniqueTrends.push(trend);
    }
  });

  return uniqueTrends;
};
