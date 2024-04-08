import { OpenAIApi, Configuration } from 'openai'; //openai's SDK
import {
  SYSTEM_ROLE_POST,
  USER_ROLE_POST,
  RESPONSE_SYSTEM_ROLE,
  RESPONSE_USER_DESC,
  RESPONSE_USER_USE,
  TREND_URL_BUTTON,
} from '../utils/openaiPromptData.js';
import * as dotenv from 'dotenv';
/**
 * Trend post generator will take values: trend, trendCategory, trendTech and generate Getting Started Guide post for the trend using Structured Chat.
 * Then it will take that generated post feed it back to it self generate a trendDescription 'trendDesc' which will be short explanation of the
 * trend & 'trendUse' best uses.
 * openai:  gpt-3.5-turbo-instruct: instruct model is much more terse and concise, it just does what it is instructed to do.
 * @param {*} trend
 * @returns
 */
//setting up access to .env
dotenv.config();
// Async function to generate blog content using OpenAI
export const generatePostContent = async (trend, trendCategory, trendTech) => {
  console.log('TREND HERE ----------------------> ', trend);
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config); //new instance of openai
  let trendPost, trendDesc, trendUse;
  console.log(RESPONSE_USER_USE);
  // Generate the Startup/How-To Blog Post using using gpt with newest training data gpt-4-1106-vision-preview
  try {
    const blogPostResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: SYSTEM_ROLE_POST,
        },
        {
          role: 'user',
          content: `${USER_ROLE_POST} about the ${trend} in the technology category of ${trendCategory}, specifically focusing on ${trendTech} technology. ${TREND_URL_BUTTON}`,
        },
      ],
    });
    const blogPostContent = blogPostResponse.data.choices[0]?.message?.content;
    // console.log('BLOG HERE ----------------------> ', blogPostContent);
    trendPost = blogPostContent || '';
  } catch (error) {
    console.error('Error generating startup/how-to blog post:', error);
    throw new Error('Failed to generate startup/how-to blog post');
    // Optionally, handle this error in a way that doesn't stop execution, depending on your requirements
  }

  // Using blogPost to generate a short description and best use using gpt with older training data
  if (trendPost) {
    try {
      const trendDescResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: 'system', content: RESPONSE_SYSTEM_ROLE },
          {
            role: 'user',
            content: `${RESPONSE_USER_DESC} here is the blog post: "${trendPost}"`,
          },
        ],
      });
      const response = trendDescResponse.data.choices[0]?.message?.content;
      trendDesc = response;
      const trendUseResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          { role: 'system', content: RESPONSE_SYSTEM_ROLE },
          {
            role: 'user',
            content: `${RESPONSE_USER_USE} (trendDesc) of the trend and list its best uses (trendUse): "${trendPost}"`,
          },
        ],
      });
      const response2 = trendUseResponse.data.choices[0]?.message?.content;
      trendUse = response2;
    } catch (error) {
      console.error('Error generating trend details:', error);
      throw new Error('Failed to generate trend details');
      // Optionally, handle this error in a way that doesn't stop execution, depending on your requirements
    }
  }
  return {
    trendPost,
    trendDesc,
    trendUse,
  };
};
// generatePostContent('Reactjs', 'Frontend Framework', 'Javascript');
