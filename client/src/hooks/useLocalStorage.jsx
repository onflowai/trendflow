import { useState, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
  //if localStorage is available (i.e. we're on the client)
  const localStorageAvailable =
    typeof window !== 'undefined' && window.localStorage;

  // initialize state safely:
  const [storedValue, setStoredValue] = useState(() => {
    if (!localStorageAvailable) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key "%s":', key, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (localStorageAvailable) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.error('Error setting localStorage key "%s":', key, error);
      }
    },
    [key, localStorageAvailable] //fully stable
  );// creating a setter that updates both state and localStorage (if available)

  return [storedValue, setValue];
}

export default useLocalStorage;
