import React from 'react';
import { createContext, useContext } from 'react';

const CombinedContext = createContext();

export const CombinedProvider = ({ children, value }) => {
  return (
    <CombinedContext.Provider value={value}>
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombinedContext = () => useContext(CombinedContext);
