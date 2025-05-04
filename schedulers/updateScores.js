import cron from 'node-cron';
import trendModel from '../models/trendModel.js';
import { calculateCombinedScore } from '../utils/trendUtils.js';
//import { executePythonScript } from '../utils/script_controller.js';//manual updates currently

/**
 * Function for scheduling trend stats update month after it was approved
 */

export const updateScores = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const trends = await trendModel
      .find({
        isApproved: true,
        views: { $gte: 100 },
        updatedAt: { $lte: oneMonthAgo },
      })
      .select('t_score f_score trendStatus views combinedScore');

    const ops = trends.flatMap((t) => {
      const newScore = calculateCombinedScore(
        t.t_score,
        t.views,
        t.trendStatus,
        t.f_score
      );
      return newScore !== t.combinedScore
        ? [
            {
              updateOne: {
                filter: { _id: t._id },
                update: { $set: { combinedScore: newScore } },
              },
            },
          ]
        : [];
    });

    if (ops.length) {
      const res = await trendModel.bulkWrite(ops);
      console.log(
        `[cron] combinedScore updated → matched:${res.matchedCount} modified:${res.modifiedCount}`
      );
    } else {
      console.log('[cron] no score changes this run');
    }
  } catch (err) {
    console.error('[cron] updateScores failed:', err);
  }
};

// Schedule the updateScores function to run at midnight 0 0 * * * (0 0 1 * * = one month)
const scheduleExpr = process.env.CRON_UPDATE_SCORES || '0 0 * * 0';
cron.schedule(scheduleExpr, updateScores); //every Sunday at 00:00
