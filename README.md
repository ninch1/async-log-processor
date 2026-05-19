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
  - enforces a 10 MB file size limit
- Job lifecycle tracking:
  - queued
  - processing
  - completed
  - failed
- Job progress tracking during file processing
- BullMQ retry handling for failed jobs
- Redis TTL cleanup for completed job records
- Result endpoint:
  - `GET /jobs/:id/result`
- Optional result filtering:
  - `?level=ERROR`
  - `?level=ERROR,WARN`
- Deletes uploaded files after successful processing
- Keeps failed upload files for debugging

- React frontend dashboard
- Upload files from the browser
- Displays upload validation errors from the backend

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
- Docker

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

### 5. Start frontend

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

The backend runs on `http://localhost:3000`.

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

The API returns a job record immediately after the file is saved and queued.

Example response:

```json
{
  "success": true,
  "job": {
    "id": "example-job-id",
    "status": "queued",
    "progress": 0,
    "result": {},
    "createdAt": 1710000000000,
    "startedAt": null,
    "completedAt": null,
    "filePath": "uploads/example-job-id.log"
  }
}
```

### Get job metadata

```http
GET /jobs/:id
```

Returns the full job record, including status, timestamps, progress, file path, and result if processing has completed.

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
Express API validates and saves file to uploads/
        ↓
API creates Redis job record
        ↓
API adds BullMQ job
        ↓
Worker receives job
        ↓
Worker updates job status/progress in Redis
        ↓
Worker streams and analyzes file
        ↓
Worker updates Redis job result
        ↓
Uploaded file is deleted after successful processing
        ↓
Completed job record expires from Redis after TTL
```

## Job Lifecycle

```txt
queued → processing → completed
                  ↘ failed
```

- `queued`: file has been saved and job has been added to the queue
- `processing`: worker has started processing the file
- `completed`: worker finished processing and result is available
- `failed`: worker failed after processing/retry attempts

## Notes

- Completed uploaded files are deleted after successful processing.
- Failed upload files are kept for debugging.
- Completed Redis job records expire automatically after a TTL.
- Redis must be running for the API, worker, and queue to work.

## Tech Stack

### Backend

- Node.js
- Express
- BullMQ
- Redis
- Busboy
- Node.js streams
- split2
- through2
- zlib
- Docker

### Frontend

- React
- Vite
- Tailwind CSS

## Project Structure

async-log-processor/
├── client/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ └── data/
│ └── package.json
│
├── server/
│ ├── controllers/
│ ├── database/
│ ├── middleware/
│ ├── queues/
│ ├── utils/
│ ├── workers/
│ ├── server.js
│ └── package.json
│
└── README.md

## Running Locally

### 1. Start Redis

```bash
docker run -d -p 6379:6379 redis
```

### 2. Install backend dependencies

From the project root:

```bash
cd server
npm install
```

### 3. Start backend API and worker

From the `server` folder:

```bash
npm run dev
```

The backend runs on:

```txt
http://localhost:3000
```

### 4. Install frontend dependencies

Open a new terminal from the project root:

```bash
cd client
npm install
```

### 5. Start frontend

From the `client` folder:

```bash
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
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

The API returns a job record immediately after the file is saved and queued.

Example response:

```json
{
  "success": true,
  "job": {
    "id": "example-job-id",
    "status": "queued",
    "progress": 0,
    "result": {},
    "createdAt": 1710000000000,
    "startedAt": null,
    "completedAt": null,
    "filePath": "uploads/example-job-id.log"
  }
}
```

### Get job metadata

```http
GET /jobs/:id
```

Returns the full job record, including status, timestamps, progress, file path, and result if processing has completed.

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

## Frontend Dashboard

The React frontend provides a simple dashboard for interacting with the backend.

Current frontend features:

- Upload supported log files from the browser
- Display selected file name before upload
- Show backend upload validation errors
- Display current job status
- Display job progress
- Display job ID
- Show processed log results after completion
- Search existing jobs by UUID
- Poll the backend for job updates while a job is active

## Project Flow

User uploads a file in the React frontend
↓
Frontend sends multipart/form-data request to Express API
↓
Express validates and saves file to uploads/
↓
API creates Redis job record
↓
API adds BullMQ job
↓
Frontend receives created job and starts polling
↓
Worker receives queued job
↓
Worker updates job status/progress in Redis
↓
Worker streams and analyzes file
↓
Worker updates Redis job result
↓
Frontend displays completed result
↓
Uploaded file is deleted after successful processing
↓
Completed job record expires from Redis after TTL

## Job Lifecycle

```txt
queued → processing → completed
                  ↘ failed
```

- `queued`: file has been saved and job has been added to the queue
- `processing`: worker has started processing the file
- `completed`: worker finished processing and result is available
- `failed`: worker failed after processing/retry attempts

## Notes

- Completed uploaded files are deleted after successful processing.
- Failed upload files are kept for debugging.
- Completed Redis job records expire automatically after a TTL.
- Redis must be running for the API, worker, and queue to work.
- The frontend expects the backend to run on `http://localhost:3000`.
- The frontend runs on `http://localhost:5173` during development.

## Future Improvements

- Add cleanup for old failed upload files
- Add tests for backend helper functions
- Add tests for frontend components
- Add more detailed log summaries
- Add Docker Compose setup
- Add deployment instructions
