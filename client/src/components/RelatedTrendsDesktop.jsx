import React from 'react';
import TrendSmall from './TrendSmall';
import Container from '../assets/wrappers/RelatedTrendsDesktop';
/**
 * Related Trends Desktop takes on data from TrendPage to display related trends in a single column
 * @param {*} relatedTrends
 * @returns
 */
const RelatedTrendsDesktop = ({ relatedTrends }) => {
  if (!relatedTrends || relatedTrends.length === 0) {
    return (
      <Container>
        <h2>No Related Trends</h2>
      </Container>
    );
  }
  return (
    <Container>
      <div className="related-trends-desktop">
        {relatedTrends.map(({ trendDesc, ...trend }) => (
          <TrendSmall
            key={trend._id} //unique key for each trend
            {...trend}
          />
        ))}
      </div>
    </Container>
  );
};

export default RelatedTrendsDesktop;
