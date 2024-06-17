import React from 'react';
import { SearchTrendsLarge, SearchTrendsSmall } from '../components';
import styled from 'styled-components';

function Trend() {
  const isLargeScreen = window.matchMedia('(min-width: 812px)').matches; // using media query hook to determine the screen size
  return (
    <Container>
      {isLargeScreen ? <SearchTrendsLarge /> : <SearchTrendsSmall />}
    </Container>
  );
}

const Container = styled.section`
  
`;

export default Trend;
