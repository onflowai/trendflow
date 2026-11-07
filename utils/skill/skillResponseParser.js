const stripMarkdownFence = (content) => {
  const trimmed = String(content || '').trim();

  if (!trimmed.startsWith('```')) {
    return trimmed;
  }

  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
};

const extractFirstJSONObject = (content) => {
  const text = String(content || '');
  const startIndex = text.indexOf('{');

  if (startIndex === -1) return '';

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const character = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === '\\') {
        escaped = true;
        continue;
      }

      if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
      continue;
    }

    if (character === '{') {
      depth += 1;
      continue;
    }

    if (character === '}') {
      depth -= 1;

      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return '';
};

export const parseModelJSONObject = (
  content,
  responseName = 'Model response'
) => {
  const cleaned = stripMarkdownFence(content);

  if (!cleaned) {
    throw new Error(`${responseName} was empty`);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const extracted = extractFirstJSONObject(cleaned);

    if (!extracted) {
      throw new Error(`${responseName} did not contain a JSON object`);
    }

    try {
      return JSON.parse(extracted);
    } catch {
      throw new Error(`${responseName} contained invalid JSON`);
    }
  }
};

const isObject = (value) => {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value)
  );
};

export const parseSkillBlueprintResponse = (content) => {
  const parsed = parseModelJSONObject(
    content,
    'Skill blueprint response'
  );

  const arrayFields = [
    'useWhen',
    'doNotUseWhen',
    'workflow',
    'commonMistakes',
  ];

  if (typeof parsed.description !== 'string') {
    throw new Error(
      'Skill blueprint did not include a description'
    );
  }

  for (const fieldName of arrayFields) {
    if (!Array.isArray(parsed[fieldName])) {
      throw new Error(
        `Skill blueprint did not include ${fieldName}`
      );
    }
  }

  if (!isObject(parsed.verification)) {
    throw new Error(
      'Skill blueprint did not include verification'
    );
  }

  if (!Array.isArray(parsed.verification.commands)) {
    throw new Error(
      'Skill blueprint verification.commands must be an array'
    );
  }

  if (!Array.isArray(parsed.verification.manualChecks)) {
    throw new Error(
      'Skill blueprint verification.manualChecks must be an array'
    );
  }

  if (typeof parsed.outputFormat !== 'string') {
    throw new Error(
      'Skill blueprint did not include outputFormat'
    );
  }

  if (!isObject(parsed.safety)) {
    throw new Error(
      'Skill blueprint did not include safety'
    );
  }

  return parsed;
};

// export const parseSkillMarkdownResponse = (content) => {
//   const parsed = parseModelJSONObject(
//     content,
//     'Skill Markdown response'
//   );

//   if (
//     typeof parsed.markdown !== 'string' ||
//     parsed.markdown.trim().length < 20
//   ) {
//     throw new Error(
//       'Skill Markdown response did not include valid markdown'
//     );
//   }

//   return parsed.markdown;
// };