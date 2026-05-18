# Async Log Processor

A Node.js backend that processes uploaded log files asynchronously using BullMQ, Redis, and streams.

## Features

- Upload log files through an API
- Save uploaded files to disk temporarily
- Queue background jobs with BullMQ
- Store job metadata and results in Redis
- Process files in a separate worker process
- Stream-based line-by-line file processing
- Log level counting:
  - INFO
  - WARN
  - ERROR
- Gzip support for compressed logs:
  - `.txt.gz`
  - `.log.gz`
- Upload validation:
  - accepts `.txt`, `.log`, `.txt.gz`, `.log.gz`
  - rejects unsupported file types
  - enforces a file size limit
- Job lifecycle tracking:
  - queued
  - processing
  - completed
  - failed
- Result endpoint:
  - `GET /jobs/:id/result`
- Optional result filtering:
  - `?level=ERROR`
  - `?level=ERROR,WARN`
- Deletes uploaded files after successful processing

## Tech Stack

- Node.js
- Express
- BullMQ
- Redis
- Busboy
- Node.js streams
- split2
- through2
- zlib

## Running Locally

### 1. Start Redis

```bash
docker run -d -p 6379:6379 redis
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the API and worker

```bash
npm run dev
```

## API Endpoints

### Create a job

```http
POST /jobs
```

Upload one supported log file using `multipart/form-data`.

Supported file types:

```txt
.txt
.log
.txt.gz
.log.gz
```

### Get job metadata

```http
GET /jobs/:id
```

Returns the full job record, including status, timestamps, file path, and result if processing is complete.

Optional filtering:

```http
GET /jobs/:id?level=ERROR,WARN
```

### Get job result

```http
GET /jobs/:id/result
```

Returns only the processed result.

Optional filtering:

```http
GET /jobs/:id/result?level=ERROR,WARN
```

If the job is not completed yet, the API returns a `409 Conflict`.

## Example Result

```json
{
  "success": true,
  "result": {
    "totalLines": 15,
    "levels": {
      "INFO": 9,
      "WARN": 3,
      "ERROR": 3
    }
  }
}
```

## Project Flow

```txt
Client uploads file
        ↓
Express API saves file to uploads/
        ↓
API creates Redis job record
        ↓
API adds BullMQ job
        ↓
Worker receives job
        ↓
Worker streams and analyzes file
        ↓
Worker updates Redis job result
        ↓
Uploaded file is deleted after success
```

## TODO

- Add Redis job cleanup / TTL
- Add retry handling for failed jobs
- Add progress tracking
- Add more detailed log summaries
- Add tests
