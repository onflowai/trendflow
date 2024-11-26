import React from 'react';
import { FilterTrendsLarge, FilterTrendsSmall } from '.';
import styled from 'styled-components';
/**
 * SearchTrends sets which filter is to be used depending on screen size
 * @param {*} param0
 * @returns
 */
function FilterTrends({
  trendCategory,
  technologies,
  isClosed,
  setIsClosed,
  isAdminPage,
  saveFilters,
  resetFilters,
  onFiltersApply,
}) {
  const isLargeScreen = window.matchMedia('(min-width: 499px)').matches; // using media query hook to determine the screen size
  return (
    <Container>
      {isLargeScreen ? (
        <FilterTrendsLarge
          isAdminPage={isAdminPage}
          trendCategory={trendCategory}
          technologies={technologies}
          isClosed={isClosed}
          setIsClosed={setIsClosed}
          saveFilters={saveFilters}
          resetFilters={resetFilters}
          onFiltersApply={onFiltersApply}
        />
      ) : (
        <FilterTrendsSmall />
      )}
    </Container>
  );
}

const Container = styled.section`
  
`;

export default FilterTrends;
