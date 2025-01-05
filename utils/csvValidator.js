import validator from 'validator';

/**
 * Validates the structure and content of CSV data.
 * @param {Array<Object>} data parsed JSON data from the CSV
 * @returns {Object} object containing sanitized data and validation status
 * @throws {Error} throws an error if validation fails
 */
export const validateAndSanitizeCSVData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array.');
  }

  const MAX_ENTRIES = 1000; // prevent excessively large data
  if (data.length > MAX_ENTRIES) {
    throw new Error(`Data exceeds maximum allowed entries (${MAX_ENTRIES}).`);
  }

  const sanitizedData = data.map((item, index) => {
    // Validate 'date' field
    if (
      typeof item.date !== 'string' ||
      !validator.isISO8601(item.date, { strict: true })
    ) {
      console.error(`Invalid 'date' at index ${index}:`, item.date);
      throw new Error(
        `Invalid 'date' format at entry ${index + 1}. Expected YYYY-MM-DD.`
      );
    }

    // validating 'count' field
    if (
      typeof item.count !== 'number' ||
      !Number.isInteger(item.count) ||
      item.count < 0
    ) {
      console.error(`Invalid 'count' at index ${index}:`, item.count);
      throw new Error(
        `Invalid 'count' value at entry ${
          index + 1
        }. Must be a non-negative integer.`
      );
    }

    const sanitizedDate = validator.escape(item.date); // sanitizing 'date' field

    return {
      date: sanitizedDate,
      count: item.count, // 'count' sanitize?
    };
  });

  return sanitizedData;
};
