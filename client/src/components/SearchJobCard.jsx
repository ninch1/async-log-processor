import { useState } from 'react';
import { getJob } from '../api/jobsApi';

function SearchJobCard({ setCurrentJob }) {
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState(null);

  // regex for uuidV4
  function isValidJobId(id) {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidV4Regex.test(id);
  }

  async function handleSearch() {
    if (!isValidJobId(searchId)) return;

    try {
      setSearchError(null);

      // Fetch an existing job by id and display it in the dashboard
      const data = await getJob(searchId);
      setCurrentJob(data.job);
    } catch (err) {
      setSearchError(err.message);
    }
  }

  return (
    <section className='mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6'>
      <h2 className='text-xl font-semibold'>Search Job by ID</h2>

      <input
        type='text'
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        maxLength={36}
        className='mt-5 py-2 pl-2 block w-full cursor-text rounded-lg border border-slate-700 bg-slate-950 text-sm text-slate-300'
      />

      <button
        onClick={handleSearch}
        disabled={!isValidJobId(searchId)}
        className='mt-5 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400'
      >
        Search
      </button>

      {searchError && (
        <p className='mt-3 rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300'>
          {searchError}
        </p>
      )}
    </section>
  );
}

export default SearchJobCard;
