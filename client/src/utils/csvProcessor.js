/**
 * Parses CSV text into JSON, skipping the first three rows
 * @param {string} text - The CSV file content as text
 * @returns {Array<Object>} - Parsed JSON data
 * @throws throws an error if CSV structure is incorrect
 */
export const parseCSV = (text) => {
  const lines = text.split(/\r\n|\n/);
  const dataLines = lines.slice(3); // skipping the first three rows

  if (dataLines.length === 0) {
    throw new Error('CSV does not contain data after skipping header rows.');
  } // ensuring there are enough lines after skipping

  const headers = ['date', 'count']; //custom headers

  const json = dataLines
    .map((line) => {
      if (!line.trim()) {
        return null;
      } // skipping empty lines

      const values = parseCSVLine(line);

      const obj = {};
      headers.forEach((header, i) => {
        if (header === 'count') {
          obj[header] = values[i] ? Number(values[i].trim()) : null;
        } else {
          obj[header] = values[i] ? values[i].trim() : null;
        }
      }); // mapping values to headers

      return obj;
    })
    .filter((item) => item !== null); // remove null entries (empty lines)

  return json;
};

/**
 * helper function to parse a single CSV line
 * @param {string} line - single line from the CSV file
 * @returns {Array<string>} - parsed values from the line
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i++; // Skip the escaped quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};
