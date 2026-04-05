const express = require('express');
const { saveJob, getJob, deleteJob } = require('./database/jobStore');
const { v4: uuidv4 } = require('uuid');
const jobQueue = require('./queues/jobQueue');

const PORT = 3000;

const app = express();

// creates a job
app.post('/jobs', async (req, res) => {
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
    return res
      .status(500)
      .json({ success: false, error: 'Failed to process log' });
  }

  res.status(201).json({ success: true, job });
});

// retreives job info
app.get('/jobs/:id', async (req, res) => {
  const { id } = req.params;
  let job = {};
  try {
    job = await getJob(id);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: `Faield to retreive job with id: ${id}` });
  }
  if (job) res.json({ success: true, job });
  else
    res
      .status(404)
      .json({ success: false, error: `Job with id: ${id} does not exist.` });
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
