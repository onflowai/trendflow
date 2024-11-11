import React, { createContext, useContext, useState } from 'react';
/**
 * Search Context
 */
const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext); // custom hook to access search context

const SearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState(''); // state to hold the search value

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
