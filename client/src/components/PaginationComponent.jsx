import React, { useState } from 'react';
import { useCombinedContext } from '../context/CombinedContext';
import customFetch from '../utils/customFetch';

const PaginationComponent = () => {
  const { pagination, updatePagination, searchValues } = useCombinedContext();
  const { currentPage, nextCursor, hasNextPage } = pagination;

  const [trends, setTrends] = useState([]); // Trends are managed locally
  const [loading, setLoading] = useState(false);

  const loadMoreTrends = async () => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    try {
      const response = await customFetch.get('/trends', {
        params: {
          ...searchValues,
          cursor: nextCursor, // Pass cursor for pagination
          limit: 8, // Adjust limit for production
        },
      });

      const {
        trends: newTrends,
        nextCursor: newNextCursor,
        hasNextPage: newHasNextPage,
      } = response.data;

      // Append new trends to the local state
      setTrends((prevTrends) => [...prevTrends, ...newTrends]);

      // updating pagination metadata in CombinedProvider
      updatePagination({
        currentPage: currentPage + 1,
        nextCursor: newNextCursor,
        hasNextPage: newHasNextPage,
      });
    } catch (error) {
      console.error('Error loading more trends:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      {trends.map((trend) => (
        <div key={trend._id}>
          <h3>{trend.trend}</h3>
        </div>
      ))}

      {hasNextPage && (
        <button onClick={loadMoreTrends} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}

      {!hasNextPage && <p>No more trends to display.</p>}
    </div>
  );
};

export default PaginationComponent;
