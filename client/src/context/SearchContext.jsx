import React, { createContext, useContext, useState } from 'react';

/**
 * Search Context:
 */
const SearchContext = createContext();
export const useSearchContext = () => useContext(SearchContext); // custom hook to access search context

const SearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState(''); // state to hold the search value

  const handleSetSearchValue = (value) => {
    setSearchValue(value); // update search value in context
  };

  const onClearSearch = () => {
    setSearchValue(''); // clear search value in context
  };
  return (
    <SearchContext.Provider
      value={{
        searchValue,
        setSearchValue: handleSetSearchValue,
        onClearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
