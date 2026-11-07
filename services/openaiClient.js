import { OpenAIApi, Configuration } from 'openai';//openai's SDK
import * as dotenv from 'dotenv';

dotenv.config(); //initializing dotenv once at module load

let openaiClient;

export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  if (!openaiClient) {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    openaiClient = new OpenAIApi(configuration);
  }
  return openaiClient;
};