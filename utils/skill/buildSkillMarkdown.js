import { sanitizePlainText } from '../sanitization.js';
import { sanitizeMarkdown } from '../sanitizeMarkdown.js';
import { BadRequestError } from '../../errors/customErrors.js';

/**
 * Turns a reviewed Skill document into the final SKILL.md file.
 * This is deterministic and does not call OpenAI.
 */
const cleanPlainText = (value) => {
  return sanitizePlainText(String(value || ''))
    .replace(/\s+/g, ' ')
    .trim();
};

const cleanMarkdown = (value) => {
  return sanitizeMarkdown(
    String(value || '')
  ).trim();
};

const yamlString = (value) => {
  return JSON.stringify(
    cleanPlainText(value)
  );
};

const addListSection = (
  lines,
  heading,
  values
) => {
  if (!Array.isArray(values) || values.length === 0) {
    return;
  }

  const cleanedValues = values
    .map(cleanPlainText)
    .filter(Boolean);

  if (cleanedValues.length === 0) {
    return;
  }

  lines.push(`## ${heading}`, '');

  for (const value of cleanedValues) {
    lines.push(`- ${value}`);
  }

  lines.push('');
};

const createCodeFence = (
  content,
  language = 'bash'
) => {
  const value = String(content || '').trim();

  if (!value) return '';

  const backtickRuns =
    value.match(/`+/g) || [];

  const longestRun = backtickRuns.reduce(
    (longest, run) =>
      Math.max(longest, run.length),
    0
  );

  const fence = '`'.repeat(
    Math.max(3, longestRun + 1)
  );

  return `${fence}${language}\n${value}\n${fence}`;
};

const addWorkflowSection = (
  lines,
  workflow
) => {
  if (!Array.isArray(workflow) || workflow.length === 0) {
    return;
  }

  lines.push('## Workflow', '');

  workflow.forEach((item, index) => {
    const step =
      Number.isInteger(item?.step) &&
      item.step > 0
        ? item.step
        : index + 1;

    const title = cleanPlainText(
      item?.title
    );

    const detail = cleanMarkdown(
      item?.detail
    );

    if (!title && !detail) return;

    lines.push(
      `### ${step}. ${
        title || `Step ${step}`
      }`,
      ''
    );

    if (detail) {
      lines.push(detail, '');
    }
  });
};

const addVerificationSection = (
  lines,
  verification
) => {
  const commands = Array.isArray(
    verification?.commands
  )
    ? verification.commands
        .map((command) =>
          String(command || '')
            .replaceAll('\0', '')
            .trim()
        )
        .filter(Boolean)
    : [];

  const manualChecks = Array.isArray(
    verification?.manualChecks
  )
    ? verification.manualChecks
        .map(cleanPlainText)
        .filter(Boolean)
    : [];

  if (
    commands.length === 0 &&
    manualChecks.length === 0
  ) {
    return;
  }

  lines.push('## Verification', '');

  if (commands.length > 0) {
    lines.push(
      '### Commands',
      '',
      createCodeFence(
        commands.join('\n')
      ),
      ''
    );
  }

  if (manualChecks.length > 0) {
    lines.push(
      '### Manual Checks',
      ''
    );

    for (const check of manualChecks) {
      lines.push(`- ${check}`);
    }

    lines.push('');
  }
};

const addTechnologySection = (
  lines,
  relatedTechs
) => {
  if (
    !Array.isArray(relatedTechs) ||
    relatedTechs.length === 0
  ) {
    return;
  }

  lines.push(
    '## Technology Context',
    ''
  );

  for (const technology of relatedTechs) {
    const value = cleanPlainText(
      technology?.value
    );

    const role = cleanPlainText(
      technology?.role || 'supporting'
    );

    if (!value) continue;

    lines.push(`- ${value} (${role})`);
  }

  lines.push('');
};

const addFilesSection = (
  lines,
  files
) => {
  if (!Array.isArray(files) || files.length === 0) {
    return;
  }

  lines.push('## Included Files', '');

  for (const file of files) {
    const filePath = cleanPlainText(
      file?.path
    );

    const kind = cleanPlainText(
      file?.kind
    );

    if (!filePath) continue;

    lines.push(
      `- \`${filePath}\`${
        kind ? ` — ${kind}` : ''
      }`
    );
  }

  lines.push('');
};

const addCompatibilitySection = (
  lines,
  compatibility
) => {
  if (!compatibility) return;

  const values = [
    [
      'Codex',
      compatibility.codex
        ? 'supported'
        : 'not supported',
    ],
    [
      'Claude Code',
      compatibility.claudeCode
        ? 'supported'
        : 'not supported',
    ],
    [
      'Cursor',
      compatibility.cursor ||
        'unsupported',
    ],
    [
      'OpenCode',
      compatibility.openCode
        ? 'supported'
        : 'not supported',
    ],
    [
      'Generic agents',
      compatibility.generic
        ? 'supported'
        : 'not supported',
    ],
  ];

  lines.push('## Compatibility', '');

  for (const [name, value] of values) {
    lines.push(`- **${name}:** ${value}`);
  }

  lines.push('');
};

const addSafetySection = (
  lines,
  safety
) => {
  if (!safety) return;

  lines.push('## Safety', '');

  lines.push(
    `- **Risk level:** ${
      cleanPlainText(
        safety.riskLevel || 'low'
      )
    }`
  );

  lines.push(
    `- **Contains scripts:** ${
      safety.hasScripts ? 'Yes' : 'No'
    }`
  );

  lines.push(
    `- **Requires network access:** ${
      safety.requiresNetwork
        ? 'Yes'
        : 'No'
    }`
  );

  lines.push(
    `- **Requires secrets:** ${
      safety.requiresSecrets
        ? 'Yes'
        : 'No'
    }`
  );

  lines.push('');
};

/**
 * Builds SKILL.md from a reviewed Skill document.
 *
 * This does not call an AI model.
 */
export const buildSkillMarkdown = (
  skillDocument
) => {
  const skill =
    typeof skillDocument?.toObject ===
    'function'
      ? skillDocument.toObject()
      : skillDocument;

  if (!skill) {
    throw new BadRequestError(
      'Skill document is required'
    );
  }

  const title = cleanPlainText(
    skill.title
  );

  const slug = cleanPlainText(
    skill.slug
  );

  const description = cleanPlainText(
    skill.description
  );

  if (!title || !slug || !description) {
    throw new BadRequestError(
      'Skill title, slug, and description are required before creating SKILL.md'
    );
  }

  const lines = [
    '---',
    `name: ${yamlString(slug)}`,
    `description: ${yamlString(description)}`,
    `version: ${yamlString(
      skill.version || '1.0.0'
    )}`,
    '---',
    '',
    `# ${title}`,
    '',
    description,
    '',
  ];

  if (skill.type || skill.category) {
    lines.push('## Skill Context', '');

    if (skill.type) {
      lines.push(
        `- **Type:** ${cleanPlainText(
          skill.type
        )}`
      );
    }

    if (skill.category) {
      lines.push(
        `- **Category:** ${cleanPlainText(
          skill.category
        )}`
      );
    }

    lines.push('');
  }

  addTechnologySection(
    lines,
    skill.relatedTechs
  );

  addListSection(
    lines,
    'Use When',
    skill.useWhen
  );

  addListSection(
    lines,
    'Do Not Use When',
    skill.doNotUseWhen
  );

  addWorkflowSection(
    lines,
    skill.workflow
  );

  addListSection(
    lines,
    'Common Mistakes',
    skill.commonMistakes
  );

  addVerificationSection(
    lines,
    skill.verification
  );

  const outputFormat = cleanPlainText(
    skill.outputFormat
  );

  if (outputFormat) {
    lines.push(
      '## Expected Output',
      '',
      outputFormat,
      ''
    );
  }

  addFilesSection(lines, skill.files);

  addCompatibilitySection(
    lines,
    skill.compatibility
  );

  addSafetySection(
    lines,
    skill.safety
  );

  const markdown = `${lines.join('\n').trim()}\n`;

  if (markdown.length > 20000) {
    throw new BadRequestError(
      'Generated SKILL.md exceeds 20000 characters'
    );
  }

  return markdown;
};