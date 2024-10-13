import React from 'react';
import Trend from './Trend';
import Container from '../assets/wrappers/RelatedTrendMobile';
/**
 * Related Trends Mobile takes on data from TrendPage to display related trends
 * @param {*} relatedTrends
 * @param {*}
 * @returns
 */
const RelatedTrendsMobile = ({ relatedTrends }) => {
  console.log('relatedTrends in Mobile: ', relatedTrends);
  if (!relatedTrends || relatedTrends.length === 0) {
    return (
      <Container>
        <h2>No Related Trends</h2>
      </Container>
    );
  }
  // Fetch related trends or pass them as props
  return (
    <Container>
      <div className="related-trends-mobile">
        {relatedTrends.map((trend) => (
          <Trend
            key={trend._id} // Ensure unique key for each trend
            {...trend} // Spread the trend data as props to the Trend component
          />
        ))}
      </div>
    </Container>
  );
};

export default RelatedTrendsMobile;
