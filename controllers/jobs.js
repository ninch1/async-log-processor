const express = require('express');
const ErrorResponse = require('../utils/ErrorResponse');
const { saveJob, getJob, deleteJob } = require('../database/jobStore');
const { v4: uuidv4 } = require('uuid');
const jobQueue = require('../queues/jobQueue');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');

// helper function for filtering levels
function filterLevels(levels, levelFilter) {
  if (!levelFilter || !levels) return levels;

  const requestedLevels = levelFilter
    .split(',')
    .map((level) => level.trim().toUpperCase());

  const filteredLevels = {};

  // Keep only the requested log levels in the response
  Object.entries(levels).forEach(([level, count]) => {
    if (requestedLevels.includes(level)) {
      filteredLevels[level] = count;
    }
  });

  return filteredLevels;
}

// initializing express router
const router = express.Router();

// POST /jobs
// Uploads a log file, saves it to disk, creates a Redis job record,
// and adds a BullMQ job for background processing.
router.post('/', async (req, res, next) => {
  let settled = false; // flag to check if response was already sent. using in callbacks (where youre not actually returning from main function)

  let bb;
  try {
    bb = busboy({ headers: req.headers }); // initialize busboy
  } catch (err) {
    return next(new ErrorResponse(err.message, 400));
  }

  const id = uuidv4();

  let hasFile = false; // used to detect missing uploads and prevent multiple files

  // job object
  let job = {
    id,
    status: 'queued',
    result: {},
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
  };

  bb.on('file', (name, file, info) => {
    if (hasFile && !settled) {
      settled = true;
      return next(
        new ErrorResponse('You can only add once file at a time', 400),
      );
    }

    hasFile = true;

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filename = info.filename.split('.');
    const fileType = filename[filename.length - 1];
    const filePath = path.join(uploadsDir, `${id}.${fileType}`);
    job.filePath = filePath;

    const writeStream = fs.createWriteStream(filePath);

    writeStream.on('error', (err) => {
      if (!settled) {
        settled = true;
        return next(new ErrorResponse('Failed to save job', 500));
      }
    });

    writeStream.on('finish', async () => {
      // adds job to redis and queue
      try {
        await saveJob(job);
        await jobQueue.add('process-log', { id, filePath });
      } catch (error) {
        await deleteJob(id);
        if (!settled) {
          settled = true;
          return next(
            new ErrorResponse(`Failed to process log with id: ${id}`, 500),
          );
        }
      }

      // sends final response
      if (!settled) {
        settled = true;
        return res.status(201).json({ success: true, job });
      }
    });

    file.pipe(writeStream);
  });

  bb.on('error', (err) => {
    if (!settled) {
      settled = true;
      return next(new ErrorResponse('Failed to add job', 500));
    }
  });

  bb.on('finish', () => {
    if (!hasFile && !settled) {
      settled = true;
      return next(new ErrorResponse('No file uploaded', 400));
    }
  });

  req.pipe(bb);
});

// GET /jobs/:id/result
// Retrieves only the completed job result.
// Supports optional level filtering with ?level=ERROR,WARN.
router.get('/:id/result', async (req, res, next) => {
  const { id } = req.params;

  // Optional query filter, e.g. ?level=ERROR,WARN
  const levelFilter = req.query.level;

  let job = {};

  try {
    // Get job record from Redis
    job = await getJob(id);
  } catch (error) {
    return next(
      new ErrorResponse(`Failed to retrieve job with id: ${id}`, 500),
    );
  }
  if (job) {
    if (job.status !== 'completed')
      // only send success true if job is completed
      return next(
        new ErrorResponse(
          `Job with id: ${id} is not completed yet. Current status: ${job.status}`,
          409,
        ),
      );

    job.result.levels = filterLevels(job.result.levels, levelFilter);
    return res.json({ success: true, job });
  } else
    return next(new ErrorResponse(`Job with id: ${id} does not exist.`, 404));
});

// GET /jobs/:id
// Retrieves full job metadata, including status, timestamps, filePath,
// and result if processing has completed.
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  // Optional query filter, e.g. ?level=ERROR,WARN
  const levelFilter = req.query.level;

  let job = {};

  try {
    // Get job record from Redis
    job = await getJob(id);
  } catch (error) {
    return next(
      new ErrorResponse(`Failed to retrieve job with id: ${id}`, 500),
    );
  }
  if (job) {
    if (job.status === 'completed') {
      job.result.levels = filterLevels(job.result.levels, levelFilter);
    }
    return res.json({ success: true, job });
  } else
    return next(new ErrorResponse(`Job with id: ${id} does not exist.`, 404));
});

module.exports = router;
