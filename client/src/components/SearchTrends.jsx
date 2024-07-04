import React from 'react';
import { SearchTrendsLarge, SearchTrendsSmall } from '../components';
import styled from 'styled-components';
/**
 * SearchTrends sets which filter is to be used depending on screen size
 * @param {*} param0
 * @returns
 */
function Trend({ trendCategory, technologies }) {
  const isLargeScreen = window.matchMedia('(min-width: 499px)').matches; // using media query hook to determine the screen size
  return (
    <Container>
      {isLargeScreen ? (
        <SearchTrendsLarge
          trendCategory={trendCategory}
          technologies={technologies}
        />
      ) : (
        <SearchTrendsSmall />
      )}
    </Container>
  );
}

const Container = styled.section`
  
`;

export default Trend;
