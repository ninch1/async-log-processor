const { updateJob, expireJob } = require('../database/jobStore');
const { Worker } = require('bullmq');
const fs = require('fs');
const split2 = require('split2');
const through2 = require('through2');
const zlib = require('zlib');

// Creates a transform function that counts each line processed by the stream
function logCounterWrapper(result) {
  return function logCounter(chunk, enc, callback) {
    const level = chunk.toString().split(' ')[0].toUpperCase();
    if (['INFO', 'WARN', 'ERROR'].includes(level))
      result.levels[level] >= 0
        ? (result.levels[level] += 1)
        : (result.levels[level] = 1); // if given type hasnt been declared yet, declare it and set to 1, else increment it
    result.totalLines++;
    callback(); // tells the stream this chunk is done and it can continue
  };
}

// delay function to help visualize
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Worker listens for jobs from the BullMQ queue and processes them in the background
new Worker(
  'job-queue',
  async (job) => {
    // Data passed from jobQueue.add('process-log', { id, filePath })
    const id = job.data.id;
    const filePath = job.data.filePath;

    // Result object will be updated while streaming through the file
    const result = { totalLines: 0, levels: {} };

    try {
      // Mark the job as actively being processed
      await updateJob(id, {
        status: 'processing',
        startedAt: Date.now(),
        progress: 0,
      });

      // --- only for visualization while testing ---
      //await delay(10000);

      // Wrap stream processing in a Promise so BullMQ waits until the stream finishes
      await new Promise((resolve, reject) => {
        // get file size for progress report
        const stats = fs.statSync(filePath);
        const totalBytes = stats.size;
        let bytesRead = 0;
        let nextProgressUpdate = 25;

        const progressStream = through2(async function (chunk, enc, callback) {
          try {
            bytesRead += chunk.length;
            const progress = Math.min(
              100,
              Math.round((bytesRead / totalBytes) * 100),
            );

            if (progress >= nextProgressUpdate) {
              await updateJob(id, { progress: nextProgressUpdate });
              nextProgressUpdate += 25;
              console.log('progress:', progress);
            }

            callback(null, chunk); // pass chunk forward
          } catch (err) {
            callback(err);
          }
        });

        /* use to slow down process , {
          highWaterMark: 64,
        }*/
        const readStream = fs.createReadStream(filePath);

        let inputStream = readStream;
        if (filePath.endsWith('.gz'))
          inputStream = readStream.pipe(zlib.createGunzip());

        // piping streams
        const mainStream = inputStream
          .pipe(progressStream)
          .pipe(split2())
          .pipe(through2(logCounterWrapper(result)));

        inputStream.on('error', reject); // checks for zlib errors

        // When stream processing finishes, delete the uploaded file and resolve the Promise
        mainStream.on('finish', () => {
          fs.unlink(filePath, (err) => {
            if (err) console.log('File Deletion error: ' + err);
          });
          resolve();
        });

        // Reject if reading or processing the stream fails
        readStream.on('error', reject);
        mainStream.on('error', reject);
      });

      // Save final result and mark job as completed
      await updateJob(id, {
        status: 'completed',
        result,
        completedAt: Date.now(),
        progress: 100,
      });

      await expireJob(id, 60 * 60); // delete completed job after 1 hour
    } catch (err) {
      // Save failure details if processing fails
      await updateJob(id, {
        status: 'failed',
        failedAt: Date.now(),
        errorMessage: err.message,
      });

      throw err;
    }
  },
  {
    // Redis connection used by BullMQ to read jobs from the queue
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
);

console.log('Worker running.');
