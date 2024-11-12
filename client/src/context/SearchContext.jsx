import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Search Context
 */
const SearchContext = createContext();
export const useSearchContext = () => useContext(SearchContext); // custom hook to access search context

const cache = {}; // in-memory cache for search results
let debounceTimeout;
const DEBOUNCE_DELAY = 500;

const SearchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(''); // state to hold the search value

  const debouncedNavigate = useCallback(
    (value) => {
      // Clear any existing debounce timer
      clearTimeout(debounceTimeout);

      // Set up a new debounce timer
      debounceTimeout = setTimeout(() => {
        if (cache[value]) return; // Avoid navigating for cached values

        const searchParams = new URLSearchParams(window.location.search);
        if (value) {
          searchParams.set('search', value);
        } else {
          searchParams.delete('search');
        }

        navigate(`/dashboard?${searchParams.toString()}`, { replace: true });
        cache[value] = true;
      }, DEBOUNCE_DELAY); // 500ms debounce delay
    },
    [navigate]
  ); // 500ms debounce delay function to navigate with search term after delay

  const handleSetSearchValue = (value) => {
    setSearchValue(value); // update search value in context
    debouncedNavigate(value); // navigate with debounced delay
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
