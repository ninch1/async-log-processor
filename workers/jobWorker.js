const { updateJob } = require('../database/jobStore');
const { Worker } = require('bullmq');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

new Worker(
  'job-queue',
  async (job) => {
    const id = job.data.id;

    // processes job
    try {
      await updateJob(id, { status: 'processing', startedAt: Date.now() });
      await delay(5000);
      await updateJob(id, { status: 'completed', completedAt: Date.now() });
    } catch (error) {
      await updateJob(id, {
        status: 'failed',
        failedAt: Date.now(),
        errorMessage: error.message,
      });
    }
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
);

console.log('Worker running.');
