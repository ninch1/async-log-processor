function ResultsCard({ currentJob }) {
  return (
    <section className='mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Results</h2>
          <p className='mt-1 text-sm text-slate-400'>
            Summary of processed log levels.
          </p>
        </div>

        {currentJob && (
          <span className='rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300'>
            {currentJob.status === 'completed' ? 'Ready' : 'Waiting'}
          </span>
        )}
      </div>

      {currentJob ? (
        currentJob.status === 'completed' ? (
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
        )
      ) : (
        ''
      )}
    </section>
  );
}

export default ResultsCard;
