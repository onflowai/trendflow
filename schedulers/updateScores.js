import cron from 'node-cron';
import trendModel from '../models/trendModel.js';
import { calculateCombinedScore } from '../utils/trendUtils.js';
import { executePythonScript } from '../utils/script_controller.js';

/**
 * Function for scheduling trend stats update month after it was approved
 */
const updateScores = async () => {
  try {
    const trends = await trendModel.find({
      isApproved: true, // Only consider approved trends
      views: { $gte: 100 }, // Only consider trends with at least 100 views
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); //

    for (let trend of trends) {
      if (new Date(trend.updatedAt) <= oneMonthAgo) {
        // Re-fetching the script data
        const scriptOutput = await executePythonScript(trend.trend);
        const data = JSON.parse(scriptOutput);

        // Updating the trend with new data
        trend.t_score = data.t_score;
        trend.f_score = data.f_score;
        trend.trendStatus = data.status;
        trend.interestOverTime = data.trends_data;
        trend.forecast = data.forecast;
        trend.flashChart = data.flashChart;

        // Calculate the combined score
        trend.combinedScore = calculateCombinedScore(
          trend.t_score,
          trend.views,
          trend.trendStatus,
          trend.f_score
        );

        await trend.save(); //updating the model
      }
    }

    console.log('Scores updated successfully');
  } catch (error) {
    console.error('Error updating scores:', error);
  }
};

// Schedule the updateScores function to run at midnight 0 0 * * * (0 0 1 * * = one month)
cron.schedule('0 0 * * *', () => {
  console.log('Running updateScores at midnight every day');
  updateScores();
});
