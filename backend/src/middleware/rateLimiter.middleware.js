import { redis } from "../config/redis";


const slidingWindowLimiter = (limit) => async (req, res, next) {
  const key = `rate:${req.path}:${req.ip}`;
  const now = Date.now();
  const windowStart = now - 60000;

  await redis.zadd(key, now, `${now} - ${Math.random()}`);
  await redis.zremrangebyscore(key, 0, windowStart);

  const count = await redis.zcard(key);
  await redis.expire(60);

  if (count > limit) {
    return res.status(429).json({ success: false, message: "Rate limit exceeded" })
  }
  next()
}

export {slidingWindowLimiter}
