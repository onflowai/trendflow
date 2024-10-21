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

  const relatedStyle = {
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--grey-50)', // Add the border style
  };
  return (
    <Container>
      <div className="related-trends-desktop">
        {relatedTrends.map(({ trendDesc, ...trend }) => (
          <TrendSmall
            key={trend._id} //unique key for each trend
            {...trend}
            relatedStyle={relatedStyle}
          />
        ))}
      </div>
    </Container>
  );
};

export default RelatedTrendsDesktop;
