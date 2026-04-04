const express = require('express');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;

const app = express();

const jobs = new Map(); // internal storage for jobs

// creates a job
app.post('/jobs', (req, res) => {
  const id = uuidv4();
  let job = { id, status: 'queued', createdAt: Date.now() };
  jobs.set(id, job);

  res.status(201).json({ success: true, job });
});

// retreives job info
app.get('/jobs/:id', (req, res) => {
  const { id } = req.params;
  const job = jobs.get(id);
  if (job) res.json({ success: true, job });
  else
    res
      .status(400)
      .json({ success: false, error: `Job with id: ${id} does not exist.` });
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
