import React from 'react';
import styled from 'styled-components';
import { Loading } from '../components';

const PaginationComponent = ({ isLoading, hasNextPage }) => {
  return (
    <Container>
      {isLoading && (
        <CustomLoading>
          <div className="loading"></div>
        </CustomLoading>
      )}
      {!hasNextPage && <p>No more trends to display.</p>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const CustomLoading = styled.div`
  position: relative;
  .loading {
    position: relative;
    width: 3rem;
    height: 3rem; 
    margin: 0 auto; /* Center within parent */
    border: 3px solid transparent;
    &::before {
      content: ''; /* preserve the spinner's gradient */
      position: absolute;
      top: -3px; /* thinner spinner */
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        var(--primary3-600),
        var(--primary2-600),
        var(--primary-600),
        rgba(255, 255, 255, 0.2)
      );
      mask: radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%);
    }
  }
`;

export default PaginationComponent;
