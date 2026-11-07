import Skill from '../models/skillModel.js';
import SkillType from '../models/skillTypeModel.js';
import { generateSlug } from '../utils/slugUtils.js';
import { generateSkillContent } from '../api/skillGenerator.js';
import { BadRequestError } from '../errors/customErrors.js';
import {
  buildSkillTitle,
  buildSkillTrendContext,
  normalizeGeneratedSkill,
  normalizeSkillTechStack,
  resolveIncludeTrendInGeneration,
  resolveUseTrendBlogForGeneration,
} from '../utils/skillUtils.js';

/**
 * Creates and generates a draft Skill from an already-saved Trend.
 *
 * Used by:
 * - submitSkill for existing Trends
 * - submitTrend for chained Trend + Skill generation
 *
 * The Trend is always stored as primaryTrend.
 * includeTrendInGeneration only controls what is sent to OpenAI.
 */
export const skillService = async ({
  trend,
  body = {},
  createdBy,
}) => {
  if (!trend?._id) {
    throw new BadRequestError(
      'A saved Trend is required for Skill generation'
    );
  }

  const requestedType = String(body.type || '')
    .trim()
    .toLowerCase();

  if (!requestedType) {
    throw new BadRequestError('Skill type is required');
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedType)) {
    throw new BadRequestError('Invalid skill type format');
  }

  const includeTrendInGeneration =
    resolveIncludeTrendInGeneration(body);

  const useTrendBlogForGeneration =
    resolveUseTrendBlogForGeneration(
      body,
      includeTrendInGeneration
    );

  const skillType = await SkillType.findOne({
    value: requestedType,
    isActive: {
      $ne: false,
    },
  }).lean();

  if (!skillType) {
    throw new BadRequestError(
      'Invalid or inactive skill type'
    );
  }

  const techStack = await normalizeSkillTechStack(
    body.trendTechs,
    {
      fallbackTechs: trend.trendTechs || [],
      fieldName: 'trendTechs',
    }
  );

  const title = buildSkillTitle({
    trendName: trend.trend,
    techStack,
    skillTypeLabel: skillType.label,
  });

  const skillSlug = String(body.skillSlug || '')
    .trim()
    .toLowerCase();

  if (!skillSlug) {
    throw new BadRequestError(
      'Skill slug is required'
    );
  }

  if (skillSlug.length > 250) {
    throw new BadRequestError(
      'Skill slug cannot exceed 250 characters'
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillSlug)) {
    throw new BadRequestError(
      'Skill slug must contain lowercase letters, numbers, and single hyphens only'
    );
  }

  const existingSkill = await Skill.findOne({
    slug: skillSlug, // use frontend-reviewed skill slug
  })
    .select('title slug isGenerated')
    .lean();

  if (existingSkill) {
    throw new BadRequestError(
      `Skill slug already exists: ${existingSkill.slug}`
    );
  }

  const draftSkill = await Skill.create({
    title,
    slug: skillSlug, // preserving frontend-reviewed slug
    description: 'Skill generation is in progress.',
    type: skillType.value,
    category: trend.trendCategory,
    primaryTrend: trend._id,
    relatedTrends: [],

    relatedTechs: techStack.map(
      ({ label, ...technology }) => technology
    ),

    markdown:
      `# ${title}\n\nSKILL.md has not been created yet.`,

    files: [],
    status: 'draft',
    isGenerated: false,

    generationMode: includeTrendInGeneration
      ? 'trend-plus-techs'
      : 'tech-stack-only',

    markdownNeedsRegeneration: true,
    createdBy,
  });

  /**
   * The draft already exists at this point.
   * If generation fails, it remains with isGenerated:false.
   */
  const generationResult = await generateSkillContent({
    title,

    skillType: {
      value: skillType.value,
      label: skillType.label,
      description: skillType.description || '',
    },

    trend: includeTrendInGeneration
      ? buildSkillTrendContext(trend, {
          includeBlog: useTrendBlogForGeneration,
        })
      : null,

    technologies: techStack.map(
      ({ value, label, role }) => ({
        value,
        label,
        role,
      })
    ),
  });

  draftSkill.set({
    ...normalizeGeneratedSkill(generationResult),

    isGenerated: true,
    markdownNeedsRegeneration: true,

    generationSource: {
      model: String(
        generationResult.model || ''
      ).slice(0, 200),

      promptVersion: String(
        generationResult.promptVersion || 'skill-v1'
      ).slice(0, 100),

      generatedAt: new Date(),
      usedTrendContext: includeTrendInGeneration,
      usedTrendBlog: useTrendBlogForGeneration,
    },
  });

  await draftSkill.save();

  return draftSkill;
};