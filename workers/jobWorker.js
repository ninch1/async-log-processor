const { updateJob } = require('../database/jobStore');
const { Worker } = require('bullmq');
const fs = require('fs');
const split2 = require('split2');
const through2 = require('through2');

function logCounterWrapper(result) {
  return function logCounter(chunk, enc, callback) {
    result.totalLines++;
    callback();
  };
}

new Worker(
  'job-queue',
  async (job) => {
    const id = job.data.id;
    const filePath = job.data.filePath;

    const result = { totalLines: 0 };

    try {
      await updateJob(id, {
        status: 'processing',
        startedAt: Date.now(),
      });

      await new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);
        const mainStream = readStream
          .pipe(split2())
          .pipe(through2(logCounterWrapper(result)));

        mainStream.on('finish', resolve);
        readStream.on('error', reject);
        mainStream.on('error', reject);
      });

      await updateJob(id, {
        status: 'completed',
        result,
        completedAt: Date.now(),
      });
    } catch (err) {
      await updateJob(id, {
        status: 'failed',
        failedAt: Date.now(),
        errorMessage: err.message,
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
