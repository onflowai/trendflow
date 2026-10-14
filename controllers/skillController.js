import Skill from '../models/skillModel.js';
import SkillType from '../models/skillTypeModel.js';
import trendModel from '../models/trendModel.js';
import { generateSlug } from '../utils/slugUtils.js';
import { generateSkillContent } from '../api/skillGenerator.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors.js';
import { buildSkillMarkdown } from '../utils/skill/buildSkillMarkdown.js';
import { skillService } from '../services/skillService.js';

const assertAdminRequest = (req) => {
  const role = req.user?.role;

  if (role !== 'admin' && role !== 'superAdmin') {
    throw new UnauthenticatedError('Admin only');
  }
};

/**
 * SUBMIT SKILL - ADMIN ONLY generates skill after trend is generated creates and immediately saves a draft Skill
 * Synchronous skill creation is initiated in trendSubmit
 * By default, all technologies attached to the source Trend are selected.
 * The admin may send trendTechs to use an edited subset or custom stack.
 *
 * removeTrendFromGeneration defaults to false.
 *
 * When true, the AI generator receives only the selected technologies and
 * skill type. The source Trend is still stored as primaryTrend and its
 * category is still stored for provenance.
 */
export const submitSkill = async (req, res) => {
  assertAdminRequest(req);

  const { slug } = req.params;

  const trend = await trendModel.findOne({
    slug,
  });

  if (!trend) {
    throw new NotFoundError('Trend not found');
  }

  const skill = await skillService({
    trend,
    body: req.body,
    createdBy: req.user.userID,
  });

  res.status(StatusCodes.CREATED).json({
    msg: 'Draft skill created',
    skill,
  });
};//end submitSkill


/**
 * CREATE SKILL MARKDOWN - ADMIN ONLY
 *
 * Creates SKILL.md from the current reviewed Skill fields.
 * This controller does not make an OpenAI request.
 */
export const createSkillMarkdown = async (req, res) => {
  assertAdminRequest(req);

  const { slug } = req.params;
  const skill = await Skill.findOne({ slug });

  if (!skill) {
    throw new NotFoundError(
      `No skill found with slug ${slug}`
    );
  }

  if (!skill.isGenerated) {
    throw new BadRequestError(
      'Skill generation must finish before creating SKILL.md'
    );
  }

  const {
    useWhen,
    doNotUseWhen,
    commonMistakes,
    verification,
    outputFormat,
    workflow,
  } = req.body || {};

  if (Array.isArray(useWhen)) {
    skill.useWhen = useWhen;
  }

  if (Array.isArray(doNotUseWhen)) {
    skill.doNotUseWhen = doNotUseWhen;
  }

  if (Array.isArray(commonMistakes)) {
    skill.commonMistakes = commonMistakes;
  }

  if (verification && typeof verification === 'object') {
    skill.verification = {
      commands: Array.isArray(verification.commands)
        ? verification.commands
        : skill.verification?.commands || [],
      manualChecks: Array.isArray(verification.manualChecks)
        ? verification.manualChecks
        : skill.verification?.manualChecks || [],
    };
  }

  if (typeof outputFormat === 'string') {
    skill.outputFormat = outputFormat;
  }

  if (Array.isArray(workflow)) {
    skill.workflow = workflow;
  }

  const markdown = buildSkillMarkdown(skill);

  skill.markdown = markdown;
  skill.markdownGeneratedAt = new Date();
  skill.markdownNeedsRegeneration = false;

  await skill.save();

  res.status(StatusCodes.OK).json({
    msg: 'SKILL.md created',
    markdown,
    skill,
  });
};//end createSkillMarkdown


/**
 * UPDATE SKILL - ADMIN ONLY
 *
 * Editable:
 *
 * title
 * description
 * type
 * relatedTechs / trendTechs
 * useWhen
 * doNotUseWhen
 * workflow
 * commonMistakes
 * verification
 * outputFormat
 * markdown
 * files
 * compatibility
 * version
 * safety
 * lastVerifiedAt
 * reviewDueAt
 *
 * Not editable here:
 *
 * status
 * category
 * primaryTrend
 * relatedTrends
 * createdBy
 * approvedBy
 * approvedAt
 * installCount
 * generationMode
 * generationSource
 * isGenerated
 */
export const updateSkill = async (req, res) => {
  assertAdminRequest(req);

  const { slug } = req.params;
  const skill = await Skill.findOne({ slug });

  if (!skill) {
    throw new NotFoundError(
      `No skill found with slug ${slug}`
    );
  }

  // const oldSlug = skill.slug;
  // const update = await buildSkillUpdatePayload({
  //   body: req.body,
  //   skill,
  // });

  if (Object.keys(update).length === 0) {
    throw new BadRequestError(
      'No editable skill fields were provided'
    );
  }

  // if (update.title !== undefined) {
  //   const nextSlug = generateSlug(update.title);

  //   const duplicateSkill = await Skill.findOne({
  //     slug: nextSlug,
  //     _id: { $ne: skill._id },
  //   })
  //     .select('title slug')
  //     .lean();

  //   if (duplicateSkill) {
  //     throw new BadRequestError(
  //       `Another skill already uses this title: ${duplicateSkill.title}`
  //     );
  //   }
  // }

  const markdownSourceFields = [
    'title',
    'description',
    'type',
    'relatedTechs',
    'useWhen',
    'doNotUseWhen',
    'workflow',
    'commonMistakes',
    'verification',
    'outputFormat',
    'files',
    'compatibility',
    'version',
    'safety',
  ];

  const markdownSourceChanged = markdownSourceFields.some(
    (fieldName) =>
      Object.prototype.hasOwnProperty.call(
        update,
        fieldName
      )
  );

  if (markdownSourceChanged) {
    update.markdownNeedsRegeneration = true;
  }

  skill.set(update);
  await skill.save();

  if (skill.slug !== oldSlug) {
    return res.status(StatusCodes.OK).json({
      msg: 'Skill modified',
      skill,
    });
  }

  res.status(StatusCodes.OK).json({
    msg: 'Skill modified',
    skill,
  });
}; //end updateSkill

/**
 * GET SKILL FOR EDIT - ADMIN ONLY
 */
export const getSkillForEdit =
  async (req, res) => {
    assertAdminRequest(req);

    const skill =
      await Skill.findOne({
        slug: req.params.slug,
      })
        .populate(
          'primaryTrend',
          'trend slug trendCategory trendTechs trendDesc trendUse generatedBlogPost'
        )
        .populate(
          'relatedTrends',
          'trend slug trendCategory'
        )
        .populate(
          'createdBy',
          'name username role'
        );

    if (!skill) {
      throw new NotFoundError(
        `No skill found with slug ${req.params.slug}`
      );
    }

  res
  .status(StatusCodes.OK)
  .json({
    skill,
  });
}; //end getSkillForEdit

/**
 * GET ALL SKILLS - ADMIN ONLY
 *
 * Large markdown and file contents are not returned in the list response.
 */
export const getAllSkills = async (
  req,
  res
) => {
  assertAdminRequest(req);

  const page = Math.max(
    Number.parseInt(
      req.query.page,
      10
    ) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      Number.parseInt(
        req.query.limit,
        10
      ) || 30,
      1
    ),
    100
  );

  const query = {};

  if (req.query.status) {
    const status = String(
      req.query.status
    ).trim();

    if (
      !SKILL_STATUSES.includes(
        status
      )
    ) {
      throw new BadRequestError(
        'Invalid skill status'
      );
    }

    query.status = status;
  }

  if (req.query.type) {
    const type = String(
      req.query.type
    )
      .trim()
      .toLowerCase();

    if (type.length > 100) {
      throw new BadRequestError(
        'Invalid skill type filter'
      );
    }

    query.type = type;
  }

  if (req.query.search) {
    const search = String(
      req.query.search
    ).trim();

    if (search.length > 100) {
      throw new BadRequestError(
        'Search query is too long'
      );
    }

    if (search) {
      const escapedSearch =
        search.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );

      query.$or = [
        {
          title: {
            $regex:
              escapedSearch,
            $options: 'i',
          },
        },
        {
          description: {
            $regex:
              escapedSearch,
            $options: 'i',
          },
        },
      ];
    }
  }

  const [skills, total] =
    await Promise.all([
      Skill.find(query)
        .select(
          '-markdown -files.content'
        )
        .populate(
          'primaryTrend',
          'trend slug trendCategory'
        )
        .populate(
          'createdBy',
          'name username role'
        )
        .sort({
          updatedAt: -1,
        })
        .skip(
          (page - 1) * limit
        )
        .limit(limit)
        .lean(),

      Skill.countDocuments(query),
    ]);

  res
    .status(StatusCodes.OK)
    .json({
      skills,

      pagination: {
        page,
        limit,
        total,
        pages:
          Math.ceil(
            total / limit
          ),
      },
    });
}; //end getAllSkills

/**
 * DELETE SKILL
 *
 * Route is restricted to superAdmin.
 */
export const deleteSkill = async (
  req,
  res
) => {
  assertAdminRequest(req);

  const skill =
    await Skill.findOneAndDelete({
      slug: req.params.slug,
    });

  if (!skill) {
    throw new NotFoundError(
      'Skill not found'
    );
  }

  res
    .status(StatusCodes.OK)
    .json({
      msg: 'Skill deleted',
      skill,
    });
}; //end deleteSkill