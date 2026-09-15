const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Base API client for Questify.
 *
 * Currently returns simulated responses with network delay.
 * When the backend is ready, swap out the simulation for real fetch calls.
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // Future: real API calls
  // const response = await fetch(url, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...options?.headers,
  //   },
  //   ...options,
  // });
  // if (!response.ok) throw new Error(`API Error: ${response.status}`);
  // return response.json();

  // For now, simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 500)
  );

  throw new Error(`API not connected: ${url} [${options?.method ?? 'GET'}]`);
}

/**
 * Helper to build a POST request body.
 */
export function postOptions(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/**
 * Helper to build a PUT request body.
 */
export function putOptions(body: unknown): RequestInit {
  return {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/**
 * Helper for DELETE requests.
 */
export function deleteOptions(): RequestInit {
  return { method: 'DELETE' };
}
