import { exec } from 'child_process';
import trendModel from '../models/trendModel.js';

export const executePythonScript = (keywords) => {
  return new Promise((resolve, reject) => {
    exec(
      `python py_scripts/trend_analytics.py "${keywords}"`,
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
