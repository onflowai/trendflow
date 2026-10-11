import { useState, useCallback, useEffect } from 'react';

const readStoredValue = (key, initialValue) => {
  const localStorageAvailable =
    typeof window !== 'undefined' && window.localStorage;

  if (!localStorageAvailable) {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);

    return item !== null
      ? JSON.parse(item)
      : initialValue;
  } catch (error) {
    console.error(
      `Error reading localStorage key "${key}": `,
      error
    );

    return initialValue;
  }
};

function useLocalStorage(key, initialValue) {
  const [storageState, setStorageState] = useState(() => ({
    key,
    value: readStoredValue(key, initialValue),
  }));

  /*
   * If the key changes, load the value stored under the new key.
   */
  useEffect(() => {
    setStorageState((current) => {
      if (current.key === key) {
        return current;
      }

      return {
        key,
        value: readStoredValue(key, initialValue),
      };
    });
  }, [key, initialValue]);

  const storedValue =
    storageState.key === key
      ? storageState.value
      : readStoredValue(key, initialValue);

  const setValue = useCallback(
    (value) => {
      setStorageState((current) => {
        const currentValue =
          current.key === key
            ? current.value
            : readStoredValue(key, initialValue);

        const valueToStore =
          typeof value === 'function'
            ? value(currentValue)
            : value;

        try {
          const localStorageAvailable =
            typeof window !== 'undefined' &&
            window.localStorage;

          if (localStorageAvailable) {
            if (
              valueToStore === null ||
              valueToStore === undefined
            ) {
              window.localStorage.removeItem(key);
            } else {
              window.localStorage.setItem(
                key,
                JSON.stringify(valueToStore)
              );
            }
          }
        } catch (error) {
          console.error(
            `Error setting localStorage key "${key}": `,
            error
          );
        }

        return {
          key,
          value: valueToStore,
        };
      });
    },
    [key, initialValue]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;