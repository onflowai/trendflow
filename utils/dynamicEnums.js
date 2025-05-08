import TrendCategory from '../models/categoryModel.js';
import Technology from '../models/technologyModel.js';

export let trendCategoryValues = [];
export let technologiesValues = [];

export const loadEnums = async () => {
  const [categories, technologies] = await Promise.all([
    TrendCategory.find({}).lean(),
    Technology.find({}).lean(),
  ]);

  trendCategoryValues = categories.map((cat) => cat.value);
  technologiesValues = technologies.map((tech) => tech.value);
};
