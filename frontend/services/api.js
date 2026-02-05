const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export const postJson = async (path, data, headers = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });

  return response.json();
};

export const patchJson = async (path, data, headers = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });

  return response.json();
};

export const getJson = async (path, headers = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers
  });

  return response.json();
};
