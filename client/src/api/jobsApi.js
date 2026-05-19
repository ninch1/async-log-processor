const API_BASE_URL = 'http://localhost:3000';

export async function uploadJob(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload file');
  }

  return data;
}

export async function getJob(id) {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}`);
  return res.json();
}

export async function getJobResult(id, levelFilter) {
  const query = levelFilter ? `?level=${levelFilter}` : '';
  const res = await fetch(`${API_BASE_URL}/jobs/${id}/result${query}`);
  return res.json();
}
