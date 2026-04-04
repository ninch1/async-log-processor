const jobs = require('../database/database');

// pass in job object. object that's set in map is reference to that same object.

module.exports = function jobWorker(jobId) {
  setTimeout(() => {
    job = jobs.get(jobId);
    job.status = 'processing';
    jobs.set(jobId, job);
    setTimeout(() => {
      job.status = 'completed';
    }, 5000);
  }, 5000);
};
