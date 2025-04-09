import React from 'react';
import { TrendMini } from '../components';
import Container from '../assets/wrappers/FeaturedTrendsDesktop';
/**
 * Featured Trends mirrors Trends Related Trends Desktop takes on data from Landing
 * to display featured trends
 * @param {*} relatedTrends
 * @returns
 */
const FeaturedTrendsDesktop = ({ featuredTrends }) => {
  const featTrends = Array.isArray(featuredTrends) ? featuredTrends : [];
  const featuredFlag = true;
  //Values used to style recharts in AllTrends & Admin pages
  const isFeatured = true;
  const chartHeight = 100;
  const chartMarginTop = 10;
  const chartMarginBottom = -60;

  if (!featTrends || featTrends.length === 0) {
    return (
      <Container>
        <h2>No Featured Trends</h2>
      </Container>
    );
  }

  const relatedStyle = {
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--grey-50)', // Add the border style
  };
  return (
    <Container>
      <div className="featured-trends-desktop">
        {featTrends.map(({ trendDesc, ...trend }) => (
          <TrendMini
            key={trend._id}
            {...trend}
            relatedStyle={relatedStyle}
            chartHeight={chartHeight}
            chartMarginTop={chartMarginTop}
            chartMarginBottom={chartMarginBottom}
            isFeatured={isFeatured}
            featuredFlag={featuredFlag}
          />
        ))}
      </div>
    </Container>
  );
};

export default FeaturedTrendsDesktop;
