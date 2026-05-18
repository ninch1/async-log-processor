export const mockJobDone = {
  id: 'demo-job-123',
  status: 'completed',
  progress: 100,
  createdAt: 1775410742884,
  startedAt: 1775410749200,
  completedAt: 1775410756400,
  result: {
    totalLines: 15,
    levels: {
      INFO: 9,
      WARN: 3,
      ERROR: 3,
    },
  },
};

export const mockProcessingJob = {
  id: 'demo-job-456',
  status: 'processing',
  progress: 50,
  createdAt: 1775410742884,
  startedAt: 1775410749200,
  completedAt: null,
  result: {},
};

export const mockFailedJob = {
  id: 'demo-job-789',
  status: 'failed',
  progress: 50,
  createdAt: 1775410742884,
  startedAt: 1775410749200,
  completedAt: null,
  failedAt: 1775410753000,
  errorMessage: 'Failed to process uploaded file',
  result: {},
};
