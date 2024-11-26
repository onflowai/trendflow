import React, { createContext, useContext, useState } from 'react';

const CombinedContext = createContext();

export const CombinedProvider = ({ children, value }) => {
  console.log('value: ', value);
  // Initialize `trends` and `pagination` as state so they update on re-render

  const [searchValues, setSearchValues] = useState(value?.searchValues || {});
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
        searchValues,
        updateSearchValues,
      }}
    >
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombinedContext = () => useContext(CombinedContext);
