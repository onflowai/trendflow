import axios from 'axios';

let cachedBlacklist = [];
let isFetching = false;
let initialized = false;

/**
 * fetches the blacklist from the URL, processes it, and caches it
 */

const fetchAndCacheBlacklist = async () => {
  if (isFetching) {
    console.log('Blacklist fetch already in progress.');
    return;
  } // preventing multiple concurrent fetches
  isFetching = true;
  console.log('Attempting to fetch blacklist...');

  try {
    const response = await axios.get(process.env.PROFANITY_LIST_URL);
    if (response.status === 200 && typeof response.data === 'string') {
      const words = response.data
        .split('\n') // splitting by newline
        .map((word) => word.trim().toLowerCase()) // triming whitespace and convert to lowercase
        .filter(Boolean); // remove empty lines

      cachedBlacklist = words;
      initialized = true; // mark as successfully initialized
      console.log(
        `Successfully fetched and cached ${cachedBlacklist.length} blacklisted words.`
      );
    } else {
      throw new Error(`Failed to fetch blacklist: Status ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching or processing blacklist:', error.message);
    initialized = true; // marking initialization attempt as complete, even if failed
    console.warn('Using empty or fallback blacklist due to fetch error.');
  } finally {
    isFetching = false; // reseting fetching flag
  }
};

/**
 * Returns the cached blacklist
 * @returns {Promise<string[]>}
 */
export const getBlacklist = async () => {
  if (!initialized && !isFetching) {
    await fetchAndCacheBlacklist();
  } // fetching only if not initialized and not currently fetching
  return cachedBlacklist;
};

fetchAndCacheBlacklist();
