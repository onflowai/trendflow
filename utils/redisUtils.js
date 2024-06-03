// import { createClient } from 'redis';

// // Initialize Redis client
// const redisClient = createClient();

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//   await redisClient.connect();
// })();

// // Function to invalidate cache for a specific trend
// const invalidateCache = async (slug) => {
//   const keys = await redisClient.keys(`trends:*:${slug}:*`);
//   for (const key of keys) {
//     await redisClient.del(key);
//   }
// };

// export { redisClient, invalidateCache };
