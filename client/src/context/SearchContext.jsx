import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Search Context
 */
const SearchContext = createContext();
export const useSearchContext = () => useContext(SearchContext); // custom hook to access search context

const SearchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(''); // state to hold the search value

  const handleSetSearchValue = (value) => {
    setSearchValue(value); // Update search value in context
  };

  const onClearSearch = () => {
    setSearchValue(''); // clear search value in context
    const searchParams = new URLSearchParams(window.location.search); // remove 'search' parameter from URL
    searchParams.delete('search');
    navigate(`/dashboard?${searchParams.toString()}`, { replace: true });
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
