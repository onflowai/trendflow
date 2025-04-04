import axios from 'axios';

const pythonApiUrl = process.env.TRENDFLOW_PY_API_URL;

/**
 * Calls the Flask Python API to analyze trends.
 * @param {string} keywords - keywords to analyze
 * @returns {object} - response data from the Python API
 * @throws {Error} - throwing an error if the API call fails
 */
export async function trendflowPyApi(keywords) {
  try {
    const response = await axios.post(
      pythonApiUrl,
      { keywords },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TRENDFLOW_PY_API_KEY,
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
