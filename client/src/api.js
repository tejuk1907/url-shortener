const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';

    try {
      const body = await response.json();
      message = body.error?.message
        || body.message
        || (typeof body.error === 'string' ? body.error : message);
    } catch {
      // Keep the friendly fallback for empty or non-JSON errors.
    }

    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export async function getUrls() {
  const data = await request('/api/urls');
  return data.urls;
}

export function createUrl(url) {
  return request('/api/urls', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export function deleteUrl(shortCode) {
  return request(`/api/urls/${encodeURIComponent(shortCode)}`, {
    method: 'DELETE',
  });
}
