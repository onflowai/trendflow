import SkillType from '../models/skillTypeModel.js';
import Technology from '../models/technologyModel.js';
import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { TECH_ROLES } from '../utils/skillData.js';

const assertAdminRequest = (req) => {
  const role = req.user?.role;

  if (role !== 'admin' && role !== 'superAdmin') {
    throw new UnauthenticatedError('Admin only');
  }
};

/**
 * GET SKILL OPTIONS - ADMIN ONLY
 *
 * Used by the Skill build section in AddTrend/EditTrend.
 * Provides:
 * - skillTypes for the "type" selector
 * - relatedTechs for the Skill tech stack selector
 * - techRoles for primary/supporting/optional role selection
 */
export const getSkillOptions = async (req, res) => {
  assertAdminRequest(req);

  const [skillTypes, technologies] = await Promise.all([
    SkillType.find({
      isActive: {
        $ne: false,
      },
    })
      .select('key label value description isActive')
      .sort({
        label: 1,
      })
      .lean(),

    Technology.find({})
      .select('key label value image fullImageUrl description')
      .sort({
        label: 1,
      })
      .lean(),
  ]);

  res.status(StatusCodes.OK).json({
    skillTypes: skillTypes.map((type) => ({
      key: type.key,
      label: type.label,
      value: type.value,
      description: type.description || '',
    })),

    relatedTechs: technologies.map((technology) => ({
      key: technology.key,
      label: technology.label || technology.value,
      value: technology.value,
      techIconUrl:
        technology.fullImageUrl ||
        technology.image ||
        '',
      description: technology.description || '',
    })),

    techRoles: TECH_ROLES,
  });
};