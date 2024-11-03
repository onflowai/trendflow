import React from 'react';
import { SearchTrendsLarge, SearchTrendsSmall } from '../components';
import styled from 'styled-components';
/**
 * SearchTrends sets which filter is to be used depending on screen size
 * @param {*} param0
 * @returns
 */
function SearchTrends({
  trendCategory,
  technologies,
  isClosed,
  setIsClosed,
  isAdminPage,
  saveFilters,
  resetFilters,
}) {
  const isLargeScreen = window.matchMedia('(min-width: 499px)').matches; // using media query hook to determine the screen size
  return (
    <Container>
      {isLargeScreen ? (
        <SearchTrendsLarge
          isAdminPage={isAdminPage}
          trendCategory={trendCategory}
          technologies={technologies}
          isClosed={isClosed}
          setIsClosed={setIsClosed}
          saveFilters={saveFilters}
          resetFilters={resetFilters}
        />
      ) : (
        <SearchTrendsSmall />
      )}
    </Container>
  );
}

const Container = styled.section`
  
`;

export default SearchTrends;
