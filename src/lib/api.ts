const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'error' in body &&
      typeof body.error === 'string'
      ? body.error
      : `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export async function uploadProductImage(
  file: File,
  token: string,
  folder: 'products' | 'categories' = 'products',
): Promise<string> {
  const query = new URLSearchParams({ fileName: file.name, folder });
  const response = await fetch(`${apiBaseUrl}/admin/images?${query}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type,
    },
    body: file,
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'error' in body &&
      typeof body.error === 'string'
      ? body.error
      : `Image upload failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }
  if (!body || typeof body !== 'object' || !('data' in body) ||
      !body.data || typeof body.data !== 'object' || !('url' in body.data) ||
      typeof body.data.url !== 'string') {
    throw new ApiError('The server returned an invalid image upload response.', 502);
  }
  return body.data.url;
}

export function apiErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The server request failed.';
}
