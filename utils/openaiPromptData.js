import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// locate config file
const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = await readFile(join(__dirname, '../config/prompts.json'), 'utf-8');
const prompts = JSON.parse(raw);

export const {
  MAX_TOKENS_POST,
  MAX_TOKENS_DESC,
  MAX_TOKENS_USE,
  SYSTEM_ROLE_POST,
  TREND_URL_BUTTON,
  DESC_SYSTEM_ROLE,
  RESPONSE_USER_DESC,
  USE_SYSTEM_ROLE,
  RESPONSE_USER_USE,
} = prompts;

//ensuring it's always a string: interpolating the token count into template
export const USER_ROLE_POST = String(prompts.USER_ROLE_POST || '')
  .replace('${MAX_TOKENS_POST}', String(MAX_TOKENS_POST || 0));