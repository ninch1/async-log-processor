const redis = require('./redisClient');

async function saveJob(job) {
  await redis.set(`job:${job.id}`, JSON.stringify(job));
}

async function getJob(id) {
  const raw = await redis.get(`job:${id}`);
  return raw ? JSON.parse(raw) : null;
}

async function updateJob(id, updates) {
  const job = await getJob(id);
  if (!job) return null;

  const updatedJob = { ...job, ...updates };
  await saveJob(updatedJob);

  return updatedJob;
}

async function deleteJob(id) {
  await redis.del(`job:${id}`);
}

async function expireJob(id, seconds) {
  await redis.expire(`job:${id}`, seconds);
}

module.exports = {
  saveJob,
  getJob,
  updateJob,
  deleteJob,
  expireJob,
};
