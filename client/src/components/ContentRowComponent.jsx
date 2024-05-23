import React from 'react';
import styled from 'styled-components';

function ContentRowComponent({ trendCategory, trendTech }) {
  return (
    <Container>
      <div className="trend-category">{trendCategory}</div>
      <div className="trend-tech">{trendTech}</div>
    </Container>
  );
}

const Container = styled.div`

`;

export default ContentRowComponent;
