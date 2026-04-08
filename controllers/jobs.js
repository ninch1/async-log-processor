const express = require('express');
const ErrorResponse = require('../utils/ErrorResponse');
const { saveJob, getJob, deleteJob } = require('../database/jobStore');
const { v4: uuidv4 } = require('uuid');
const jobQueue = require('../queues/jobQueue');
const busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// creates a job
router.post('/', async (req, res, next) => {
  let settled = false; // flag to check if response was already sent. use in callbacks (where youre not actually returning from main function)

  let bb;
  try {
    bb = busboy({ headers: req.headers }); // initialize busboy
  } catch (err) {
    return next(new ErrorResponse(err.message, 400));
  }

  const id = uuidv4();

  let hasFile = false;

  // job object
  let job = {
    id,
    status: 'queued',
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

// retreives job info
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  let job = {};
  try {
    job = await getJob(id);
  } catch (error) {
    return next(
      new ErrorResponse(`Faield to retreive job with id: ${id}`, 500),
    );
  }
  if (job) res.json({ success: true, job });
  else
    return next(new ErrorResponse(`Job with id: ${id} does not exist.`, 404));
});

module.exports = router;
