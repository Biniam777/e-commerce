const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

const request = async (path, options = {}) => {
  const { body, headers, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = { success: false, message: 'Server returned an invalid response' };
    }
  }

  if (!response.ok) {
    const requestError = new Error(data?.message || 'Request failed');
    requestError.status = response.status;
    requestError.data = data;
    throw requestError;
  }

  return data;
};

export { API_BASE_URL, request as apiRequest };