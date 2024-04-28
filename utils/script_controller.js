import { exec } from 'child_process';
import { quote } from 'shell-quote';
/**
 * Script management. Triggers the python scripts
 * @param {*} keywords
 * @returns
 */
export const executePythonScript = (keywords) => {
  return new Promise((resolve, reject) => {
    console.log('trend keyword in script controller: ', keywords);
    const safeKeywords = quote([keywords]); // Correct usage of quote to escape keywords
    exec(
      `python py_scripts/trend_controller.py "${safeKeywords}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return reject(stderr);
        }
        console.log(`stdout: ${stdout}`);

        resolve(stdout);
      }
    );
  });
};
executePythonScript('MongoDB')
  .then((output) => {
    console.log('Output from Python:', output);
  })
  .catch((err) => {
    console.error('Error executing Python script:', err);
  });
