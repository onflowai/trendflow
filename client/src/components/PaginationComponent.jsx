import React, { useState } from 'react';
import { useCombinedContext } from '../context/CombinedContext';
import customFetch from '../utils/customFetch';

const PaginationComponent = ({ loadMoreTrends, hasNextPage, currentPage }) => {
  return (
    <div>
      {hasNextPage && (
        <button onClick={loadMoreTrends}>
          Load More (Page {currentPage + 1})
        </button>
      )}
      {!hasNextPage && <p>No more trends to display.</p>}
    </div>
  );
};

export default PaginationComponent;
