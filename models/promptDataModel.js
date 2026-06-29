import mongoose from 'mongoose';

const { Schema } = mongoose;

const trendPromptSchema = new Schema(
  {
    MAX_TOKENS_POST: {
      type: Number,
      required: true,
      min: 1,
      max: 16000,
    },
    MAX_TOKENS_DESC: {
      type: Number,
      required: true,
      min: 1,
      max: 16000,
    },
    MAX_TOKENS_USE: {
      type: Number,
      required: true,
      min: 1,
      max: 16000,
    },
    SYSTEM_ROLE_POST: {
      type: String,
      required: true,
    },
    USER_ROLE_POST: {
      type: String,
      required: true,
    },
    TREND_URL_BUTTON: {
      type: String,
      required: true,
    },
    DESC_SYSTEM_ROLE: {
      type: String,
      required: true,
    },
    RESPONSE_USER_DESC: {
      type: String,
      required: true,
    },
    USE_SYSTEM_ROLE: {
      type: String,
      required: true,
    },
    RESPONSE_USER_USE: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
    strict: 'throw',
  }
);

const skillPromptSchema = new Schema(
  {
    SKILL_DEFAULT_MODEL: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    SKILL_PROMPT_VERSION: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    SKILL_BLUEPRINT_MAX_TOKENS: {
      type: Number,
      required: true,
      min: 1,
      max: 16000,
    },
    SKILL_BLUEPRINT_TEMPERATURE: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
    },
    SKILL_DEFAULT_OUTPUT_FORMAT: {
      type: String,
      required: true,
      maxlength: 5000,
    },
  },
  {
    _id: false,
    strict: 'throw',
  }
);

const promptDataSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      immutable: true,
    },

    trend: {
      type: trendPromptSchema,
      required: true,
    },

    skill: {
      type: skillPromptSchema,
      required: true,
    },

    lastSeededAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
  }
);

const PromptData =
  mongoose.models.PromptData ||
  mongoose.model('PromptData', promptDataSchema);

export default PromptData;