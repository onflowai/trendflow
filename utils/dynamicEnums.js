import TrendCategory from '../models/categoryModel.js';
import Technology from '../models/technologyModel.js';
import SkillType from '../models/skillTypeModel.js';

export let trendCategoryValues = [];
export let technologiesValues = [];
export let skillTypeValues = [];

export const loadEnums = async () => {
  const [categories, technologies, skillTypes] = await Promise.all([
    TrendCategory.find({})
      .select('value')
      .lean(),

    Technology.find({})
      .select('value')
      .lean(),

    SkillType.find({
      isActive: {
        $ne: false,
      },
    })
      .select('value')
      .sort({
        sortOrder: 1,
        label: 1,
      })
      .lean(),
  ]);

  trendCategoryValues = categories.map(
    (category) => category.value
  );

  technologiesValues = technologies.map(
    (technology) => technology.value
  );

  skillTypeValues = skillTypes.map(
    (skillType) => skillType.value
  );
};