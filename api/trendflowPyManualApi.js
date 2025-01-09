import axios from 'axios';
/**
 * Processes manual trend approval data using a Python API or external service.
 *
 * @param {string} slug - slug of the trend to approve
 * @param {Array<Object>} data - parsed JSON data from the CSV
 * @returns {Object} - response from the Python API
 */
export const trendflowPyManualApi = async (slug, data) => {
  try {
    const response = await axios.post(
      process.env.TRENDFLOW_PY_MANUAL_API_URL,
      {
        slug: slug,
        data: data,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':
            process.env.TRENDFLOW_PY__MANUAL_API_KEY || 'your-manual-api-key',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      'Error in trendflowPyManualApi:',
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      error:
        error.response?.data?.msg ||
        error.message ||
        'Unknown error occurred in trendflowPyManualApi',
    };
  }
};
