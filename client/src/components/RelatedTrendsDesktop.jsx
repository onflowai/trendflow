import React from 'react';
import TrendSmall from './TrendSmall';
import Container from '../assets/wrappers/RelatedTrendsDesktop';
/**
 * Related Trends Desktop takes on data from TrendPage to display related trends in a single column
 * @param {*} relatedTrends
 * @returns
 */
const RelatedTrendsDesktop = ({
  relatedTrends,
  savedTrends,
  onSave,
  onRemove,
}) => {
  //Values used to style recharts in AllTrends & Admin pages
  const chartHeight = 100;
  const chartMarginTop = 10;
  const chartMarginBottom = -60;

  if (!relatedTrends || relatedTrends.length === 0) {
    return (
      <Container>
        <h2>No Related Trends</h2>
      </Container>
    );
  }

  const relatedStyle = {
    borderRadius: 'var(--border-radius)',
    border: '1.5px solid var(--border-color)', // Add the border style
  };
  return (
    <Container>
      <div className="related-trends-desktop">
        {relatedTrends.map(({ trendDesc, ...trend }) => (
          <TrendSmall
            key={trend._id}
            {...trend}
            relatedStyle={relatedStyle}
            chartHeight={chartHeight}
            chartMarginTop={chartMarginTop}
            chartMarginBottom={chartMarginBottom}
            savedTrends={savedTrends}
            onSave={onSave}
            onRemove={onRemove}
          />
        ))}
      </div>
    </Container>
  );
};

export default RelatedTrendsDesktop;
