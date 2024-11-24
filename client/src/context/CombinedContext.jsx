import React, { createContext, useContext, useState } from 'react';

const CombinedContext = createContext();

export const CombinedProvider = ({ children, value }) => {
  console.log('value: ', value);
  // Initialize `trends` and `pagination` as state so they update on re-render
  const [pagination, setPagination] = useState({
    totalTrends: value?.trends?.totalTrends || 0,
    pagesNumber: value?.trends?.pagesNumber || 0,
    currentPage: value?.trends?.currentPage || 1,
    nextCursor: value?.trends?.nextCursor || null,
    hasNextPage: value?.trends?.hasNextPage || false,
  });

  const [searchValues, setSearchValues] = useState(value?.searchValues || {});
  // Function to update pagination metadata
  const updatePagination = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      ...newPagination,
    }));
  };
  // Update function to modify `trends` and `pagination` state directly
  const updateSearchValues = (newSearchValues) => {
    setSearchValues((prev) => ({
      ...prev,
      ...newSearchValues,
    }));
  };

  return (
    <CombinedContext.Provider
      value={{
        pagination,
        updatePagination,
        searchValues,
        updateSearchValues,
      }}
    >
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombinedContext = () => useContext(CombinedContext);
