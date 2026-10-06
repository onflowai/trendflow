import { getOpenAIClient } from '../services/openaiClient.js';
import { withOpenAIRetries } from '../utils/openaiRetry.js';
import { buildSkillBlueprintMessages } from '../utils/skill/skillPromptBuilder.js';
import { parseSkillBlueprintResponse } from '../utils/skill/skillResponseParser.js';
import { loadSkillPromptData } from '../utils/promptDataLoader.js';
import {
  BadRequestError,
  ExternalServiceError,
} from '../errors/customErrors.js';
import { getOpenAIErrorDetails } from '../utils/openaiErrorDetails.js';

/**
 * Safely extracts the generated message content from the
 * older OpenAI SDK response shape.
 */
const getResponseContent = (response) => {
  return response?.data?.choices?.[0]?.message?.content ?? '';
};

/**
 * Sends the OpenAI request and parses its response.
 *
 * Temporary API/network failures are handled by withOpenAIRetries.
 * Malformed model output receives one additional generation attempt.
 */
const createParsedCompletion = async ({
  openai,
  model,
  messages,
  temperature,
  maxTokens,
  parser,
  responseName,
  onStageChange,
}) => {
  let lastError;

  for (
    let outputAttempt = 0;
    outputAttempt < 2;
    outputAttempt += 1
  ) {
    try {
      onStageChange?.('requesting-skill-blueprint');

      const response = await withOpenAIRetries(
        () =>
          openai.createChatCompletion({
            model,
            temperature:
              outputAttempt === 0
                ? temperature
                : Math.min(temperature, 0.1),
            max_tokens: maxTokens,
            messages,
          }),
        {
          operationName: responseName,

          onRetry: (retry) => {
            console.warn('OpenAI request retry', {
              ...retry,
              model,
              outputAttempt: outputAttempt + 1,
            });
          },
        }
      );

      const content = getResponseContent(response);

      onStageChange?.('parsing-skill-blueprint');

      return parser(content);
    } catch (error) {
      lastError = error;

      // OpenAI/network errors have already used the retry helper.
      // Do not treat them as malformed model output.
      if (error?.response) {
        throw error;
      }

      console.warn('Invalid Skill blueprint output', {
        responseName,
        model,
        outputAttempt: outputAttempt + 1,
        maximumOutputAttempts: 2,
        message: error?.message || 'Unknown parser error',
      });
    }
  }

  throw new Error(
    `${responseName} failed: ${
      lastError?.message || 'invalid model output'
    }`
  );
};

/**
 * Generates the structured values used to build a Skill.
 *
 * SKILL.md is not generated here.
 * The admin reviews these values first, then the server creates
 * SKILL.md deterministically from the saved Skill document.
 */
export const generateSkillContent = async ({
  title,
  skillType,
  trend = null,
  technologies,
}) => {
  if (!title || typeof title !== 'string') {
    throw new BadRequestError(
      'Skill title is required'
    );
  }

  if (
    !skillType ||
    typeof skillType !== 'object' ||
    !skillType.value
  ) {
    throw new BadRequestError(
      'Skill type is required'
    );
  }

  if (
    !Array.isArray(technologies) ||
    technologies.length < 1
  ) {
    throw new BadRequestError(
      'At least one technology is required for Skill generation'
    );
  }

  let skillPromptData;

  try {
    skillPromptData =
      await loadSkillPromptData(); // Load cached Mongo prompt values
  } catch (error) {
    console.error('Failed to load Skill prompt data', {
      operation: 'generateSkillContent',
      stage: 'loading-skill-prompts',
      errorName: error?.name || null,
      message: error?.message || 'Unknown prompt loading error',
    });

    throw error; // Mongo/configuration failure, not OpenAI
  }

  const {
    SKILL_DEFAULT_MODEL,
    SKILL_PROMPT_VERSION,
    SKILL_BLUEPRINT_MAX_TOKENS,
    SKILL_BLUEPRINT_TEMPERATURE,
  } = skillPromptData;

  let stage = 'building-skill-messages';

  try {
    const messages = buildSkillBlueprintMessages({
      title,
      skillType,
      trend,
      technologies,
      skillPromptData,
    });

    const openai = getOpenAIClient();

    const blueprint = await createParsedCompletion({
      openai,
      model: SKILL_DEFAULT_MODEL,
      messages,
      temperature: SKILL_BLUEPRINT_TEMPERATURE,
      maxTokens: SKILL_BLUEPRINT_MAX_TOKENS,
      parser: parseSkillBlueprintResponse,
      responseName: 'Skill blueprint generation',

      onStageChange: (currentStage) => {
        stage = currentStage; // Preserve exact failure stage
      },
    });

    return {
      ...blueprint,
      model: SKILL_DEFAULT_MODEL,
      promptVersion: SKILL_PROMPT_VERSION,
    };
  } catch (error) {
    const details = getOpenAIErrorDetails(error, {
      operation: 'generateSkillContent',
      model: SKILL_DEFAULT_MODEL,
      stage,
    });

    console.error(
      'Skill generation failed',
      details
    );

    throw new ExternalServiceError(
      'Failed to generate Skill content',
      {
        service: 'openai',
        cause: error,
      }
    );
  }
};