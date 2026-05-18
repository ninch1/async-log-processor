const { Queue } = require('bullmq');

const jobQueue = new Queue('job-queue', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
});

module.exports = jobQueue;
