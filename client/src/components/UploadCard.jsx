import { useState } from 'react';

function UploadCard() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]); // take first one since we are using only 1 file
  }

  function handleUpload() {
    console.log(selectedFile);
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
    </div>
  );
}

export default UploadCard;
