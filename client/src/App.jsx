import React from 'react';
import { mockJobDone, mockProcessingJob, mockFailedJob } from './data/mockData';
import UploadCard from './components/UploadCard';

function App() {
  const currentJob = mockJobDone;

  let statusColor;

  if (currentJob.status.toLowerCase() === 'completed') {
    statusColor = 'text-green-400';
  } else if (currentJob.status.toLowerCase() === 'processing') {
    statusColor = 'text-yellow-400';
  } else {
    statusColor = 'text-red-400';
  }

  const formattedStatus =
    currentJob.status[0].toUpperCase() + currentJob.status.slice(1);

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100'>
      <div className='mx-auto max-w-5xl px-6 py-10'>
        <header className='mb-10'>
          <h1 className='text-4xl font-bold'>Async Log Processor</h1>
          <p className='mt-2 text-slate-400'>
            Upload log files, process them in the background, and view results.
          </p>
        </header>

        <section className='grid gap-6 md:grid-cols-2'>
          <UploadCard />

          <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
            <h2 className='text-xl font-semibold'>Job Status</h2>

            <p className={`mt-2 font-semibold ${statusColor}`}>
              {formattedStatus}
            </p>

            <div className='mt-4'>
              <p className='text-sm text-slate-400'>Job ID</p>
              <p className='mt-1 break-all rounded-lg bg-slate-950 px-3 py-2 font-mono text-sm text-slate-300'>
                {currentJob.id}
              </p>
            </div>

            <div className='mt-4'>
              <p className='text-sm text-slate-400'>Progress</p>
              <div className='mt-2 h-2 rounded-full bg-slate-800'>
                <div
                  className='h-2 rounded-full bg-blue-500'
                  style={{ width: `${currentJob.progress}%` }}
                />
              </div>
              <p className='mt-1 text-sm text-slate-400'>
                {currentJob.progress}%
              </p>
            </div>
          </div>
        </section>

        <section className='mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Results</h2>
              <p className='mt-1 text-sm text-slate-400'>
                Summary of processed log levels.
              </p>
            </div>

            <span className='rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300'>
              {currentJob.status === 'completed' ? 'Ready' : 'Waiting'}
            </span>
          </div>

          {currentJob.status === 'completed' ? (
            <div>
              <div className='mb-6 rounded-lg bg-slate-950 p-4'>
                <p className='text-sm text-slate-400'>Total Lines</p>
                <p className='mt-1 text-3xl font-bold'>
                  {currentJob.result.totalLines}
                </p>
              </div>

              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='rounded-lg border border-slate-800 bg-slate-950 p-4'>
                  <p className='text-sm text-slate-400'>INFO</p>
                  <p className='mt-2 text-2xl font-semibold text-blue-400'>
                    {currentJob.result.levels.INFO || 0}
                  </p>
                </div>

                <div className='rounded-lg border border-slate-800 bg-slate-950 p-4'>
                  <p className='text-sm text-slate-400'>WARN</p>
                  <p className='mt-2 text-2xl font-semibold text-yellow-400'>
                    {currentJob.result.levels.WARN || 0}
                  </p>
                </div>

                <div className='rounded-lg border border-slate-800 bg-slate-950 p-4'>
                  <p className='text-sm text-slate-400'>ERROR</p>
                  <p className='mt-2 text-2xl font-semibold text-red-400'>
                    {currentJob.result.levels.ERROR || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='rounded-lg border border-dashed border-slate-700 bg-slate-950 p-6 text-center'>
              <p className='text-slate-400'>
                Results will appear after the job is completed.
              </p>
            </div>
          )}
        </section>

        <section className='mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6'>
          <h2 className='text-xl font-semibold'>Search Job by ID</h2>
        </section>
      </div>
    </main>
  );
}

export default App;
