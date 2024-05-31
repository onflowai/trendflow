import axios from 'axios';

/**
 * Script management. Triggers the python scripts via Flask API
 * @param {*} keywords
 * @returns
 */
export const executePythonScript = async (keywords) => {
  try {
    console.log('trend keyword in script controller: ', keywords);

    // Send POST request to Flask server with keywords
    const response = await axios.post(
      'http://127.0.0.1:5000/run-script',
      {
        keywords: keywords,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log(`Output from Python: ${response.data.output}`);
    return response.data.output;
  } catch (error) {
    console.error(`Error executing Python script: ${error}`);
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${error.response.data}`);
    }
    throw error;
  }
};
// TEST
// executePythonScript('Vite')
//   .then((output) => {
//     console.log('Output from Python:', output);
//   })
//   .catch((err) => {
//     console.error('Error executing Python script:', err);
//   });
