import * as dotenv from 'dotenv';
import path from 'path';

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Explicitly load .env.<environment>
const envPath = path.resolve(process.cwd(), `.env.${env}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`Failed to load ${envPath}:`, result.error);
} else {
  console.log(`Loaded environment variables from ${envPath} inside loadEnv`);
}
