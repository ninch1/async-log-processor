import { useEffect, useState } from 'react';
import { getJob, uploadJob } from '../api/jobsApi';

function UploadCard({
  selectedFile,
  setSelectedFile,
  currentJob,
  setCurrentJob,
}) {
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!currentJob) return;
    if (currentJob.status === 'completed' || currentJob.status === 'failed')
      return;

    const interval = setInterval(async () => {
      const data = await getJob(currentJob.id);
      setCurrentJob(data.job);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentJob]);

  async function handleFileChange(e) {
    setSelectedFile(e.target.files[0]); // take first one since we are using only 1 file
  }

  async function handleUpload() {
    if (!selectedFile) return;

    try {
      setUploadError(null);

      const data = await uploadJob(selectedFile);

      setCurrentJob(data.job);
    } catch (err) {
      setUploadError(err.message);
    }
  }

  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
      <h2 className='text-xl font-semibold'>Upload Log File</h2>

      <p className='mt-1 text-sm text-slate-400'>
        Supported: .txt, .log, .txt.gz, .log.gz
      </p>

      <input
        type='file'
        accept='.txt,.log,.gz'
        onChange={handleFileChange}
        className='mt-5 block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-950 text-sm text-slate-300 file:mr-4 file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-slate-100 hover:file:bg-slate-700'
      />

      {selectedFile && (
        <p className='mt-3 text-sm text-slate-400'>
          Selected: <span className='text-slate-200'>{selectedFile.name}</span>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className='mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400'
      >
        Upload
      </button>

      {uploadError && (
        <p className='mt-3 rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300'>
          {uploadError}
        </p>
      )}
    </div>
  );
}

export default UploadCard;
