# Async Log Processor

A Node.js backend that processes log files asynchronously using BullMQ and Redis.

## Features

- Upload log files via API
- Background job processing with BullMQ
- Redis-based job storage
- Stream-based file processing in worker
- Job lifecycle tracking:
  - queued
  - processing
  - completed
  - failed
- Result generation (e.g. totalLines)

## Running locally

1. Start Redis:
   docker run -d -p 6379:6379 redis

2. Install dependencies:
   npm install

3. Run the API and worker:

   Option A (recommended):
   npm run dev

   Option B (run separately):
   node src/server.js
   node src/workers/jobWorker.js

## TODO

- Add log filtering (ERROR, WARN, etc.)
- Support .gz files
- Improve result analysis (counts, summaries)
- Add result endpoint
