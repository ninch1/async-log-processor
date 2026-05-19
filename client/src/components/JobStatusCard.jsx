function JobStatusCard({ currentJob }) {
  if (!currentJob) {
    return (
      <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h2 className='text-xl font-semibold'>Job Status</h2>

        <div className='mt-4'>
          <p className='rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-400'>
            Please upload a file or search for a job.
          </p>
        </div>
      </div>
    );
  }

  let statusColor = 'text-red-400';
  const currentStatus = currentJob.status.toLowerCase();

  if (currentStatus === 'completed') {
    statusColor = 'text-green-400';
  } else if (currentStatus === 'processing' || currentStatus === 'queued') {
    statusColor = 'text-yellow-400';
  }

  const formattedStatus =
    currentJob.status[0].toUpperCase() + currentJob.status.slice(1);

  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
      <h2 className='text-xl font-semibold'>Job Status</h2>

      <p className={`mt-2 font-semibold ${statusColor}`}>{formattedStatus}</p>

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
        <p className='mt-1 text-sm text-slate-400'>{currentJob.progress}%</p>
      </div>
    </div>
  );
}

export default JobStatusCard;
