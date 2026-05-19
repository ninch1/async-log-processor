import { useState } from 'react';
import UploadCard from './components/UploadCard';
import JobStatusCard from './components/JobStatusCard';
import ResultsCard from './components/ResultsCard';
import SearchJobCard from './components/SearchJobCard';

function App() {
  const [currentJob, setCurrentJob] = useState(null);

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
          <UploadCard currentJob={currentJob} setCurrentJob={setCurrentJob} />

          <JobStatusCard currentJob={currentJob} />
        </section>

        <ResultsCard currentJob={currentJob} />

        <SearchJobCard setCurrentJob={setCurrentJob} />
      </div>
    </main>
  );
}

export default App;
