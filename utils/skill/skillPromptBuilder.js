const stringifyContext = (value) => {
  return JSON.stringify(value, null, 2);
};

const replaceRequiredPlaceholder = ({
  template,
  placeholder,
  value,
}) => {
  const placeholderToken = `\${${placeholder}}`;
  const promptTemplate = String(template || '');

  if (!promptTemplate.includes(placeholderToken)) {
    throw new Error(
      `Skill prompt is missing required placeholder: ${placeholderToken}`
    );
  }

  return promptTemplate
    .split(placeholderToken)
    .join(String(value ?? ''));
};

export const buildSkillBlueprintMessages = ({
  title,
  skillType,
  trend,
  technologies,
  skillPromptData,
}) => {
  const {
    SKILL_PROMPT_VERSION,
    SKILL_DEFAULT_OUTPUT_FORMAT,
    SKILL_BLUEPRINT_SYSTEM_PROMPT,
    SKILL_BLUEPRINT_USER_PROMPT,
  } = skillPromptData;

  const sourceContext = {
    title,
    skillType,
    technologies,
    trend: trend || null,
    defaultOutputFormat: SKILL_DEFAULT_OUTPUT_FORMAT,
  };

  const system = replaceRequiredPlaceholder({
    template: SKILL_BLUEPRINT_SYSTEM_PROMPT,
    placeholder: 'SKILL_PROMPT_VERSION',
    value: SKILL_PROMPT_VERSION,
  }).trim();

  const user = replaceRequiredPlaceholder({
    template: SKILL_BLUEPRINT_USER_PROMPT,
    placeholder: 'SKILL_SOURCE_CONTEXT',
    value: stringifyContext(sourceContext),
  }).trim();

  return [
    {
      role: 'system',
      content: system,
    },
    {
      role: 'user',
      content: user,
    },
  ];
};