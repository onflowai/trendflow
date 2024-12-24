import axios from 'axios';

// It's better to store the API URL in environment variables for flexibility
const pythonApiUrl =
  process.env.TRENDFLOW_PY_API_URL || 'http://127.0.0.1:5002/api/analyze';
//|| 'http://localhost:5002/api/analyze'

/**
 * Calls the Flask Python API to analyze trends.
 * @param {string} keywords - The keywords to analyze.
 * @returns {object} - The response data from the Python API.
 * @throws {Error} - Throws an error if the API call fails.
 */
export async function trendflowPyApi(keywords) {
  try {
    const response = await axios.post(
      pythonApiUrl,
      { keywords },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TRENDFLOW_PY_API_KEY, // Ensure this is set in your environment variables
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error calling Python API:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
