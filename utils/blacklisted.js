import axios from 'axios';

// URL for the profanity list
const PROFANITY_LIST_URL = 'https://raw.githubusercontent.com/coffee-and-fun/google-profanity-words/refs/heads/main/data/en.txt';

// In-memory cache for the blacklist
let cachedBlacklist = [];
let isFetching = false; // Flag to prevent multiple fetches simultaneously
let initialized = false; // Flag to track if initialization attempt was made

/**
 * Fetches the blacklist from the URL, processes it, and caches it.
 */
const fetchAndCacheBlacklist = async () => {
  // Prevent multiple concurrent fetches
  if (isFetching) {
    console.log('Blacklist fetch already in progress.');
    return;
  }
  isFetching = true;
  console.log('Attempting to fetch blacklist...');

  try {
    const response = await axios.get(PROFANITY_LIST_URL);
    if (response.status === 200 && typeof response.data === 'string') {
      const words = response.data
        .split('\n') // Split by newline
        .map(word => word.trim().toLowerCase()) // Trim whitespace and convert to lowercase
        .filter(Boolean); // Remove empty lines

      cachedBlacklist = words;
      initialized = true; // Mark as successfully initialized
      console.log(`Successfully fetched and cached ${cachedBlacklist.length} blacklisted words.`);
    } else {
      throw new Error(`Failed to fetch blacklist: Status ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching or processing blacklist:', error.message);
    // Optional: Fallback to a minimal hardcoded list or keep the cache empty
    // cachedBlacklist = ['admin', 'test']; // Example fallback
    initialized = true; // Mark initialization attempt as complete, even if failed
    console.warn('Using empty or fallback blacklist due to fetch error.');
  } finally {
    isFetching = false; // Reset fetching flag
  }
};

/**
 * Returns the cached blacklist.
 * Ensures the list is fetched on the first call if not already initialized.
 * @returns {Promise<string[]>} A promise that resolves to the array of blacklisted words.
 */
export const getBlacklist = async () => {
  // Fetch only if not initialized and not currently fetching
  if (!initialized && !isFetching) {
    await fetchAndCacheBlacklist();
  }
  // If already fetching, the caller will effectively wait until isFetching is false
  // and initialized might become true. Subsequent calls will get the cached list.
  // A more robust solution might involve a promise queue, but this is simpler.

  // Return the current state of the cache
  return cachedBlacklist;
};

// --- Initialize the blacklist when the module loads ---
// We trigger the fetch immediately, but consumers should use getBlacklist()
// which handles the async nature and ensures initialization is attempted.
fetchAndCacheBlacklist();

// Note: The old B_LIST export is removed.
// export const B_LIST = [ ... ]; // REMOVED
