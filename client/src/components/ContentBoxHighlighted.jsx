import React from 'react';
import { DangerousHTML } from '../components';
import styled from 'styled-components';

function ContentBoxHighlighted({ trendUse }) {
  return (
    <Container>
      <DangerousHTML html={trendUse} />
    </Container>
  );
}

const Container = styled.div`


`;

export default ContentBoxHighlighted;
