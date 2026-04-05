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

## Running locally

1. Start Redis:
   docker run -d -p 6379:6379 redis

2. Install dependencies:
   npm install

3. Start API and worker:
   npm run dev

## TODO

- Add file upload support
- Implement stream-based log processing
- Store job results
