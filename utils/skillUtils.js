import path from 'node:path';
import SkillType from '../models/skillTypeModel.js';
import Technology from '../models/technologyModel.js';
import { sanitizePlainText } from './sanitization.js';
import { sanitizeMarkdown } from './sanitizeMarkdown.js';
import { assertNoLongStringAbuse } from './stringGuard.js';
import { BadRequestError } from '../errors/customErrors.js';
import {
  FILE_KINDS,
  TECH_ROLES,
  CURSOR_MODES,
  RISK_LEVELS,
} from '../utils/skillData.js';


const guardContent = (value, fieldName, options = {}) => {
  try {
    assertNoLongStringAbuse(value, options);
  } catch (error) {
    throw new BadRequestError(`${fieldName}: ${error.message}`);
  }
};

export const parseSkillJSONField = (value, fieldName) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    throw new BadRequestError(`Invalid ${fieldName} format`);
  }
};

export const parseSkillBoolean = (value, fieldName) => {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }

  throw new BadRequestError(`${fieldName} must be a boolean`);
};

/**
 * Supports either frontend field:
 *
 * removeTrendFromGeneration: true
 * includeTrendInGeneration: false
 *
 * Do not send both.
 */
export const resolveIncludeTrendInGeneration = (body) => {
  const hasRemoveField = body.removeTrendFromGeneration !== undefined;
  const hasIncludeField = body.includeTrendInGeneration !== undefined;

  if (hasRemoveField && hasIncludeField) {
    throw new BadRequestError(
      'Send either removeTrendFromGeneration or includeTrendInGeneration, not both'
    );
  }

  if (hasRemoveField) {
    return !parseSkillBoolean(
      body.removeTrendFromGeneration,
      'removeTrendFromGeneration'
    );
  }

  if (hasIncludeField) {
    return parseSkillBoolean(
      body.includeTrendInGeneration,
      'includeTrendInGeneration'
    );
  }

  return true;
};

export const resolveUseTrendBlogForGeneration = (
  body,
  includeTrendInGeneration
) => {
  if (!includeTrendInGeneration) {
    return false;
  }

  if (body.useTrendBlogForGeneration === undefined) {
    return true;
  }

  return parseSkillBoolean(
    body.useTrendBlogForGeneration,
    'useTrendBlogForGeneration'
  );
};

export const cleanSkillText = (
  value,
  fieldName,
  {
    minLength = 0,
    maxLength = 1000,
    required = false,
    guard = true,
  } = {}
) => {
  if (value === undefined) return undefined;

  const cleaned = sanitizePlainText(value)
    .replace(/\s+/g, ' ')
    .trim();

  if (required && !cleaned) {
    throw new BadRequestError(`${fieldName} is required`);
  }

  if (cleaned.length < minLength) {
    throw new BadRequestError(
      `${fieldName} must contain at least ${minLength} characters`
    );
  }

  if (cleaned.length > maxLength) {
    throw new BadRequestError(
      `${fieldName} cannot exceed ${maxLength} characters`
    );
  }

  if (guard && cleaned) {
    guardContent(cleaned, fieldName);
  }

  return cleaned;
};

export const cleanSkillMarkdown = (
  value,
  fieldName,
  {
    minLength = 0,
    maxLength = 20000,
    required = false,
  } = {}
) => {
  if (value === undefined) return undefined;

  const cleaned = sanitizeMarkdown(String(value || '')).trim();

  if (required && !cleaned) {
    throw new BadRequestError(`${fieldName} is required`);
  }

  if (cleaned.length < minLength) {
    throw new BadRequestError(
      `${fieldName} must contain at least ${minLength} characters`
    );
  }

  if (cleaned.length > maxLength) {
    throw new BadRequestError(
      `${fieldName} cannot exceed ${maxLength} characters`
    );
  }

  if (cleaned) {
    guardContent(cleaned, fieldName, {
      maxSingleTokenLen: 300,
      maxCharRun: 80,
      minWordCount: 40,
    });
  }

  return cleaned;
};

const cleanRawString = (
  value,
  fieldName,
  {
    maxLength = 2000,
    required = false,
  } = {}
) => {
  const cleaned = String(value ?? '')
    .replaceAll('\0', '')
    .trim();

  if (required && !cleaned) {
    throw new BadRequestError(`${fieldName} is required`);
  }

  if (cleaned.length > maxLength) {
    throw new BadRequestError(
      `${fieldName} cannot exceed ${maxLength} characters`
    );
  }

  return cleaned;
};

export const cleanSkillStringArray = (
  value,
  fieldName,
  {
    maxItems = 20,
    maxItemLength = 1000,
    preserveCode = false,
  } = {}
) => {
  if (value === undefined) return undefined;

  const parsed = parseSkillJSONField(value, fieldName);

  if (!Array.isArray(parsed)) {
    throw new BadRequestError(`${fieldName} must be an array`);
  }

  if (parsed.length > maxItems) {
    throw new BadRequestError(
      `${fieldName} cannot contain more than ${maxItems} items`
    );
  }

  return parsed.map((item, index) => {
    if (preserveCode) {
      return cleanRawString(item, `${fieldName}[${index}]`, {
        required: true,
        maxLength: maxItemLength,
      });
    }

    return cleanSkillText(item, `${fieldName}[${index}]`, {
      required: true,
      maxLength: maxItemLength,
    });
  });
};

export const cleanSkillWorkflow = (value) => {
  if (value === undefined) return undefined;

  const parsed = parseSkillJSONField(value, 'workflow');

  if (!Array.isArray(parsed)) {
    throw new BadRequestError('workflow must be an array');
  }

  if (parsed.length > 30) {
    throw new BadRequestError(
      'workflow cannot contain more than 30 steps'
    );
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new BadRequestError(
        `workflow[${index}] must be an object`
      );
    }

    return {
      step: index + 1,
      title: cleanSkillText(
        item.title,
        `workflow[${index}].title`,
        {
          required: true,
          maxLength: 200,
        }
      ),
      detail: cleanSkillMarkdown(
        item.detail,
        `workflow[${index}].detail`,
        {
          required: true,
          maxLength: 3000,
        }
      ),
    };
  });
};

export const cleanSkillVerification = (value) => {
  if (value === undefined) return undefined;

  const parsed = parseSkillJSONField(value, 'verification');

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new BadRequestError('verification must be an object');
  }

  return {
    commands:
      cleanSkillStringArray(
        parsed.commands || [],
        'verification.commands',
        {
          maxItems: 30,
          maxItemLength: 2000,
          preserveCode: true,
        }
      ) || [],
    manualChecks:
      cleanSkillStringArray(
        parsed.manualChecks || [],
        'verification.manualChecks',
        {
          maxItems: 30,
          maxItemLength: 1000,
        }
      ) || [],
  };
};

export const cleanSkillFiles = (value) => {
  if (value === undefined) return undefined;

  const parsed = parseSkillJSONField(value, 'files');

  if (!Array.isArray(parsed)) {
    throw new BadRequestError('files must be an array');
  }

  if (parsed.length > 20) {
    throw new BadRequestError(
      'files cannot contain more than 20 items'
    );
  }

  const usedPaths = new Set();
  let totalContentLength = 0;

  return parsed.map((file, index) => {
    if (!file || typeof file !== 'object' || Array.isArray(file)) {
      throw new BadRequestError(`files[${index}] must be an object`);
    }

    const rawPath = String(file.path || '')
      .replaceAll('\0', '')
      .trim()
      .replace(/\\/g, '/');

    const normalizedPath = path.posix.normalize(rawPath);

    if (
      !rawPath ||
      rawPath.length > 250 ||
      normalizedPath === '..' ||
      normalizedPath.startsWith('../') ||
      normalizedPath.startsWith('/')
    ) {
      throw new BadRequestError(
        `files[${index}].path must be a safe relative path`
      );
    }

    if (usedPaths.has(normalizedPath)) {
      throw new BadRequestError(
        `Duplicate file path: ${normalizedPath}`
      );
    }

    usedPaths.add(normalizedPath);

    const kind = String(file.kind || '').trim();

    if (!FILE_KINDS.includes(kind)) {
      throw new BadRequestError(`files[${index}].kind is invalid`);
    }

    const content =
      file.content === undefined || file.content === null
        ? undefined
        : String(file.content).replaceAll('\0', '');

    if (content !== undefined && content.length > 50000) {
      throw new BadRequestError(
        `files[${index}].content cannot exceed 50000 characters`
      );
    }

    totalContentLength += content?.length || 0;

    if (totalContentLength > 250000) {
      throw new BadRequestError(
        'Combined file content cannot exceed 250000 characters'
      );
    }

    let url;

    if (file.url !== undefined && file.url !== null && file.url !== '') {
      url = String(file.url).trim();

      if (url.startsWith('/')) {
        if (url.startsWith('//') || url.includes('\0')) {
          throw new BadRequestError(`files[${index}].url is invalid`);
        }
      } else {
        try {
          const parsedUrl = new URL(url);

          if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error('Invalid URL protocol');
          }

          url = parsedUrl.toString();
        } catch {
          throw new BadRequestError(`files[${index}].url is invalid`);
        }
      }
    }

    if (content === undefined && !url) {
      throw new BadRequestError(
        `files[${index}] must contain content or a URL`
      );
    }

    return {
      path: normalizedPath,
      kind,
      ...(content !== undefined ? { content } : {}),
      ...(url ? { url } : {}),
    };
  });
};

/**
 * When rawValue is undefined, all technologies from the source Trend
 * are used. This supports the default "all selected" frontend behavior.
 */
export const normalizeSkillTechStack = async (
  rawValue,
  {
    fallbackTechs = [],
    fieldName = 'trendTechs',
  } = {}
) => {
  const parsed =
    rawValue === undefined
      ? fallbackTechs
      : parseSkillJSONField(rawValue, fieldName);

  if (!Array.isArray(parsed) || parsed.length < 1) {
    throw new BadRequestError('At least one technology is required');
  }

  if (parsed.length > 5) {
    throw new BadRequestError(
      'A maximum of 5 technologies is allowed'
    );
  }

  const selected = parsed.map((item, index) => {
    const technologyValue = String(
      typeof item === 'string' ? item : item?.value || ''
    ).trim();

    if (!technologyValue) {
      throw new BadRequestError(
        `${fieldName}[${index}].value is required`
      );
    }

    const requestedRole =
      item && typeof item === 'object'
        ? String(item.role || '').trim()
        : '';

    if (requestedRole && !TECH_ROLES.includes(requestedRole)) {
      throw new BadRequestError(
        `${fieldName}[${index}].role is invalid`
      );
    }

    return {
      value: technologyValue,
      role:
        index === 0
          ? 'primary'
          : requestedRole && requestedRole !== 'primary'
            ? requestedRole
            : 'supporting',
    };
  });

  const values = selected.map((technology) => technology.value);

  if (new Set(values).size !== values.length) {
    throw new BadRequestError(
      'Duplicate technologies are not allowed'
    );
  }

  const technologyDocuments = await Technology.find({
    value: { $in: values },
  })
    .select('value label image fullImageUrl')
    .lean();

  const technologiesByValue = new Map(
    technologyDocuments.map((technology) => [
      technology.value,
      technology,
    ])
  );

  const missingValues = values.filter(
    (value) => !technologiesByValue.has(value)
  );

  if (missingValues.length > 0) {
    throw new BadRequestError(
      `Unknown technologies: ${missingValues.join(', ')}`
    );
  }

  return selected.map((selectedTechnology) => {
    const technology = technologiesByValue.get(
      selectedTechnology.value
    );

    return {
      value: technology.value,
      label: technology.label || technology.value,
      techIconUrl:
        technology.fullImageUrl ||
        technology.image ||
        '',
      role: selectedTechnology.role,
    };
  });
};

const comparableTitlePart = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
};

/**
 * Produces:
 *
 * Trend - Remaining Techs - Skill Type
 *
 * Example:
 *
 * Next.js - React - TypeScript - Debugging
 *
 * If the first technology represents the Trend itself, it is not repeated.
 */
export const buildSkillTitle = ({
  trendName,
  techStack,
  skillTypeLabel,
}) => {
  const safeTrendName = cleanSkillText(trendName, 'Trend name', {
    required: true,
    maxLength: 150,
  });

  const safeTypeLabel = cleanSkillText(
    skillTypeLabel,
    'Skill type label',
    {
      required: true,
      maxLength: 100,
    }
  );

  const usedParts = new Set([
    comparableTitlePart(safeTrendName),
  ]);

  const technologyParts = [];

  for (const technology of techStack) {
    const label = cleanSkillText(
      technology.label || technology.value,
      'Technology label',
      {
        required: true,
        maxLength: 100,
      }
    );

    const comparable = comparableTitlePart(label);

    if (!comparable || usedParts.has(comparable)) continue;

    usedParts.add(comparable);
    technologyParts.push(label);
  }

  const title = [
    safeTrendName,
    ...technologyParts,
    safeTypeLabel,
  ].join(' - ');

  if (title.length > 250) {
    throw new BadRequestError(
      'Generated skill title cannot exceed 250 characters'
    );
  }

  return title;
};

export const buildSkillTrendContext = (
  trend,
  {
    includeBlog = true,
  } = {}
) => {
  const generatedBlogPost = includeBlog
    ? sanitizeMarkdown(
        String(trend.generatedBlogPost || '')
      )
        .trim()
        .slice(0, 8000)
    : '';

  return {
    name: sanitizePlainText(
      trend.trend
    ).trim(),

    category: sanitizePlainText(
      trend.trendCategory
    ).trim(),

    description: sanitizePlainText(
      trend.trendDesc
    ).trim(),

    use: sanitizeMarkdown(
      String(trend.trendUse || '')
    )
      .trim()
      .slice(0, 2000),

    ...(generatedBlogPost
      ? {
          gettingStartedMarkdown:
            generatedBlogPost,
        }
      : {}),
  };
};

export const normalizeGeneratedSkill = (result) => {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new BadRequestError('Skill generation failed');
  }

  const generatedSafety = result.safety || {};

  return {
    description: cleanSkillText(
      result.description,
      'Generated description',
      {
        required: true,
        minLength: 10,
        maxLength: 500,
      }
    ),

    useWhen:
      cleanSkillStringArray(
        result.useWhen || [],
        'Generated useWhen',
        {
          maxItems: 20,
          maxItemLength: 1000,
        }
      ) || [],

    doNotUseWhen:
      cleanSkillStringArray(
        result.doNotUseWhen || [],
        'Generated doNotUseWhen',
        {
          maxItems: 20,
          maxItemLength: 1000,
        }
      ) || [],

    workflow:
      cleanSkillWorkflow(result.workflow || []) || [],

    commonMistakes:
      cleanSkillStringArray(
        result.commonMistakes || [],
        'Generated commonMistakes',
        {
          maxItems: 20,
          maxItemLength: 1000,
        }
      ) || [],

    verification:
      cleanSkillVerification(
        result.verification || {}
      ) || {
        commands: [],
        manualChecks: [],
      },

    outputFormat:
      cleanSkillText(
        result.outputFormat,
        'Generated outputFormat',
        {
          maxLength: 1000,
        }
      ) ||
      'Issue, likely cause, exact file to check, minimal fix, verification, optional improvement',

    safety: {
      hasScripts: Boolean(
        generatedSafety.hasScripts
      ),

      requiresNetwork: Boolean(
        generatedSafety.requiresNetwork
      ),

      requiresSecrets: Boolean(
        generatedSafety.requiresSecrets
      ),

      riskLevel: RISK_LEVELS.includes(
        generatedSafety.riskLevel
      )
        ? generatedSafety.riskLevel
        : 'low',
    },
  };
};

const cleanCompatibility = (value, currentCompatibility) => {
  const parsed = parseSkillJSONField(value, 'compatibility');

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new BadRequestError('compatibility must be an object');
  }

  const update = {};

  for (const fieldName of [
    'codex',
    'claudeCode',
    'openCode',
    'generic',
  ]) {
    if (parsed[fieldName] !== undefined) {
      if (typeof parsed[fieldName] !== 'boolean') {
        throw new BadRequestError(
          `compatibility.${fieldName} must be a boolean`
        );
      }

      update[fieldName] = parsed[fieldName];
    }
  }

  if (parsed.cursor !== undefined) {
    if (!CURSOR_MODES.includes(parsed.cursor)) {
      throw new BadRequestError(
        'compatibility.cursor is invalid'
      );
    }

    update.cursor = parsed.cursor;
  }

  const current = currentCompatibility?.toObject
    ? currentCompatibility.toObject()
    : { ...(currentCompatibility || {}) };

  return {
    ...current,
    ...update,
  };
};

const cleanSafety = ({
  value,
  currentSafety,
  effectiveFiles,
}) => {
  const parsed =
    value === undefined
      ? {}
      : parseSkillJSONField(value, 'safety');

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new BadRequestError('safety must be an object');
  }

  const update = {};

  for (const fieldName of [
    'requiresNetwork',
    'requiresSecrets',
  ]) {
    if (parsed[fieldName] !== undefined) {
      if (typeof parsed[fieldName] !== 'boolean') {
        throw new BadRequestError(
          `safety.${fieldName} must be a boolean`
        );
      }

      update[fieldName] = parsed[fieldName];
    }
  }

  if (parsed.riskLevel !== undefined) {
    if (!RISK_LEVELS.includes(parsed.riskLevel)) {
      throw new BadRequestError('safety.riskLevel is invalid');
    }

    update.riskLevel = parsed.riskLevel;
  }

  const current = currentSafety?.toObject
    ? currentSafety.toObject()
    : { ...(currentSafety || {}) };

  return {
    ...current,
    ...update,
    hasScripts: effectiveFiles.some(
      (file) => file.kind === 'script'
    ),
  };
};

const cleanDate = (value, fieldName) => {
  if (value === null || value === '') return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new BadRequestError(`${fieldName} must be a valid date`);
  }

  return date;
};

/**
 * /**
 * Creates an allowlisted update object
 * Fields such as createdBy, status, approvedBy, primaryTrend,
 * installCount, and generationSource are deliberately ignored.
 * @param {*} param0 
 * @returns 
 */
export const buildSkillUpdatePayload = async ({
  body,
  skill,
}) => {
  const update = {};

  if (body.title !== undefined) {
    update.title = cleanSkillText(body.title, 'title', {
      required: true,
      minLength: 2,
      maxLength: 250,
    });
  }

  if (body.description !== undefined) {
    update.description = cleanSkillText(
      body.description,
      'description',
      {
        required: true,
        minLength: 10,
        maxLength: 500,
      }
    );
  }

  if (body.type !== undefined) {
    const type = String(body.type || '')
      .trim()
      .toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(type)) {
      throw new BadRequestError('Invalid skill type format');
    }

    const typeExists = await SkillType.exists({
      value: type,
      isActive: { $ne: false },
    });

    if (!typeExists) {
      throw new BadRequestError(
        'Invalid or inactive skill type'
      );
    }

    update.type = type;
  }

  const rawRelatedTechs =
    body.relatedTechs !== undefined
      ? body.relatedTechs
      : body.trendTechs;

  if (rawRelatedTechs !== undefined) {
    const fieldName =
      body.relatedTechs !== undefined
        ? 'relatedTechs'
        : 'trendTechs';

    const techStack = await normalizeSkillTechStack(
      rawRelatedTechs,
      { fieldName }
    );

    update.relatedTechs = techStack.map(
      ({ label, ...technology }) => technology
    );
  }

  for (const fieldName of [
    'useWhen',
    'doNotUseWhen',
    'commonMistakes',
  ]) {
    if (body[fieldName] !== undefined) {
      update[fieldName] = cleanSkillStringArray(
        body[fieldName],
        fieldName,
        {
          maxItems: 20,
          maxItemLength: 1000,
        }
      );
    }
  }

  if (body.workflow !== undefined) {
    update.workflow = cleanSkillWorkflow(body.workflow);
  }

  if (body.verification !== undefined) {
    update.verification = cleanSkillVerification(
      body.verification
    );
  }

  if (body.outputFormat !== undefined) {
    update.outputFormat = cleanSkillText(
      body.outputFormat,
      'outputFormat',
      {
        required: true,
        maxLength: 1000,
      }
    );
  }

  // if (body.markdown !== undefined) {
  //   update.markdown = cleanSkillMarkdown(
  //     body.markdown,
  //     'markdown',
  //     {
  //       required: true,
  //       minLength: 20,
  //       maxLength: 20000,
  //     }
  //   );
  // }

  const files = cleanSkillFiles(body.files);

  if (files !== undefined) {
    update.files = files;
  }

  if (body.compatibility !== undefined) {
    update.compatibility = cleanCompatibility(
      body.compatibility,
      skill.compatibility
    );
  }

  if (body.safety !== undefined || files !== undefined) {
    const effectiveFiles =
      files !== undefined
        ? files
        : skill.files || [];

    update.safety = cleanSafety({
      value: body.safety,
      currentSafety: skill.safety,
      effectiveFiles,
    });
  }

  if (body.version !== undefined) {
    const version = String(body.version || '').trim();

    if (
      !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)
    ) {
      throw new BadRequestError(
        'version must use semantic version format, for example 1.0.0'
      );
    }

    update.version = version;
  }

  if (body.lastVerifiedAt !== undefined) {
    update.lastVerifiedAt = cleanDate(
      body.lastVerifiedAt,
      'lastVerifiedAt'
    );
  }

  if (body.reviewDueAt !== undefined) {
    update.reviewDueAt = cleanDate(
      body.reviewDueAt,
      'reviewDueAt'
    );
  }

  return update;
};