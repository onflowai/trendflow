// import cron from 'node-cron';
// import { redisClient } from '../redisClient.js';
// import TrendModel from '../models/trendModel.js';

// export const startScheduledJobs = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       const viewCounts = await redisClient.hGetAll('trend_views');
//       for (const slug in viewCounts) {
//         const views = parseInt(viewCounts[slug], 10);
//         await TrendModel.findOneAndUpdate({ slug }, { $inc: { views } });
//         await redisClient.hDel('trend_views', slug);
//       }
//     } catch (error) {
//       console.error('Error updating view counts from Redis to MongoDB:', error);
//     }
//   });
// };
