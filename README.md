# Async Log Processor

A Node.js backend that processes jobs asynchronously using BullMQ and Redis.

## Features

- Create jobs via API
- Background job processing with BullMQ
- Redis-based job storage
- Job lifecycle tracking:
  - queued
  - processing
  - completed
  - failed
- Centralized error handling middleware
- Modular project structure (controllers, middleware, utils)

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

- Add file upload support
- Implement stream-based log processing
- Store job results
