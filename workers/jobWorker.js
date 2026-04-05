const { updateJob } = require('../database/jobStore');
const { Worker } = require('bullmq');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

new Worker(
  'job-queue',
  async (job) => {
    const id = job.data.id;

    try {
      await updateJob(id, { status: 'processing' });
      await delay(5000);
      await updateJob(id, { status: 'completed' });
    } catch (error) {
      console.error(error);
    }
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
);
