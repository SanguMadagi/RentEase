async function makeRequest(path, options = {}) {
  const token = localStorage.getItem('token'); // or wherever you store it
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const resp = await fetch(path, {
    credentials: 'include', // keep this if you also use cookie sessions
    ...options,
    headers
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`${resp.status} ${resp.statusText} - ${body || 'Unauthorized'}`);
  }
  return resp.json();
}