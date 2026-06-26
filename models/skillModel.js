import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugUtils.js';
import {
  trendCategoryValues,
  technologiesValues,
  skillTypeValues,
} from '../utils/dynamicEnums.js';

const skillStatusValues = [
  'draft',
  'submitted',
  'approved',
  'rejected',
  'deprecated',
];

const SkillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: skillTypeValues,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: trendCategoryValues,
      index: true,
    },
    primaryTrend: {
      type: mongoose.Types.ObjectId,
      ref: 'Trend',
      required: true,
      index: true,
    },//trend with which skill was generated on submit or after
    relatedTrends: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Trend',
      },
    ],//relevant trends that also have skills
    relatedTechs: {
      type: [
        {
          _id: false,
          value: {
            type: String,
            enum: technologiesValues,
            required: true,
          },
          techIconUrl: String,
          role: {
            type: String,
            enum: ['primary', 'supporting', 'optional'],
            default: 'supporting',
          },
        },
      ],
      default: [],
    },// tech context used to generate the skill
    useWhen: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          return arr.length <= 20;
        },
        message: 'Too many useWhen items',
      },
    },
    doNotUseWhen: {
      type: [String],
      default: [],
    },
    workflow: {
      type: [
        {
          _id: false,
          step: Number,
          title: String,
          detail: String,
        },
      ],
      default: [],
    },
    commonMistakes: {
      type: [String],
      default: [],
    },
    verification: {
      commands: {
        type: [String],
        default: [],
      },
      manualChecks: {
        type: [String],
        default: [],
      },
    },
    outputFormat: {
      type: String,
      default:
        'Issue, likely cause, exact file to check, minimal fix, verification, optional improvement',
      maxlength: 1000,
    },
    markdown: {
      type: String,
      required: true,
      maxlength: 20000,
    },//final generated SKILL.md content
    files: {
      type: [
        {
          _id: false,
          path: String,
          kind: {
            type: String,
            enum: ['reference', 'script', 'asset', 'template'],
          },
          content: String,
          url: String,
        },
      ],
      default: [],
    },//optional extra files that can be exported with SKILL.md
    compatibility: {
      codex: {
        type: Boolean,
        default: true,
      },
      claudeCode: {
        type: Boolean,
        default: true,
      },
      cursor: {
        type: String,
        enum: ['native', 'rules', 'memory', 'unsupported'],
        default: 'rules',
      },
      openCode: {
        type: Boolean,
        default: true,
      },
      generic: {
        type: Boolean,
        default: true,
      },
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    status: {
      type: String,
      enum: skillStatusValues,
      default: 'draft',
      index: true,
    },
    isGenerated: {
      type: Boolean,
      default: true,
    },
    generationMode: {
      type: String,
      enum: ['trend-only', 'trend-plus-techs', 'manual', 'bundle-derived'],
      default: 'trend-plus-techs',
    },
    generationSource: {
      model: String,
      promptVersion: String,
      generatedAt: Date,
    },
    safety: {
      hasScripts: {
        type: Boolean,
        default: false,
      },
      requiresNetwork: {
        type: Boolean,
        default: false,
      },
      requiresSecrets: {
        type: Boolean,
        default: false,
      },
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
      },
    },
    installCount: {
      type: Number,
      default: 0,
    },
    lastVerifiedAt: {
      type: Date,
    },
    reviewDueAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

SkillSchema.index({ status: 1, type: 1 });
SkillSchema.index({ category: 1, type: 1 });
SkillSchema.index({ 'relatedTechs.value': 1 });
SkillSchema.index({ primaryTrend: 1, status: 1 });
SkillSchema.index({ installCount: -1 });

SkillSchema.pre('validate', async function (next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = generateSlug(this.title);

    const exists = await mongoose.models.Skill.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    }).exec();

    if (exists) {
      throw new Error('Skill already exists. Duplicate skill slugs are not allowed.');
    }
  }

  next();
});

export default mongoose.model('Skill', SkillSchema);