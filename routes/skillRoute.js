import { Router } from 'express';

//Instantiating the Router
const router = Router();

import {
  submitSkill,
  updateSkill,
  deleteSkill,
  getAllSkills,
  getSkillForEdit,
  createSkillMarkdown
} from '../controllers/skillController.js';
import { getSkillOptions } from '../controllers/skillOptionsController.js';
import { rateLimitSubmitTrend } from '../middleware/rateLimitMiddleware.js';
import { validateSlugParam } from '../middleware/validationMiddleware.js';
import {
  authorizedAdmin,
  authenticateUser,
  authorizedSuperAdmin,
  authorizedPermissions,
} from '../middleware/authMiddleware.js';

/**
 * every skill management route is private and admin-only
 * guests and regular users cannot submit list read drafts edit or delete skills
 */
router
  .route('/options')
  .get(
    authenticateUser,
    authorizedAdmin,
    getSkillOptions
  ); //skill form selector data
router.post(
  '/submit/:slug',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('write'),
  rateLimitSubmitTrend, //reuse existing AI generation limiter until a skill-specific limiter is added
  validateSlugParam,
  submitSkill
);
router.patch(
  '/:slug/create-markdown',
  authenticateUser,
  authorizedAdmin,
  authorizedPermissions('write'),
  validateSlugParam,
  createSkillMarkdown
);
router.get(
  '/admin/all-skills',
  authenticateUser,
  authorizedAdmin,
  getAllSkills
);
router
  .route('/edit/:slug')
  .get(
    authenticateUser,
    authorizedAdmin,
    validateSlugParam,
    getSkillForEdit
  )
  .patch(
    authenticateUser,
    authorizedAdmin,
    authorizedPermissions('write'),
    validateSlugParam,
    updateSkill
  )
  .delete(
    authenticateUser,
    authorizedSuperAdmin,
    validateSlugParam,
    deleteSkill
  );

export default router;