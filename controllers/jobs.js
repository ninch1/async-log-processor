const express = require('express');
const ErrorResponse = require('../utils/ErrorResponse');
const { saveJob, getJob, deleteJob } = require('../database/jobStore');
const { v4: uuidv4 } = require('uuid');
const jobQueue = require('../queues/jobQueue');

const router = express.Router();

// creates a job
router.post('/', async (req, res, next) => {
  const id = uuidv4();

  // job object
  let job = {
    id,
    status: 'queued',
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
  };

  // adds job to redis and queue
  try {
    await saveJob(job);
    await jobQueue.add('process-log', { id });
  } catch (error) {
    await deleteJob(id);
    return next(new ErrorResponse(`Failed to process log with id: ${id}`, 500));
  }

  res.status(201).json({ success: true, job });
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
