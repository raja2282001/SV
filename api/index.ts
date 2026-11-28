import type { Request, Response } from 'express';
import app from '../server/index.js';

export default function handler(request: Request, response: Response): void {
  const requestUrl = new URL(request.url, 'http://localhost');
  const apiPath = requestUrl.searchParams.get('path');

  if (!apiPath) {
    response.status(404).json({ error: 'API route not found.' });
    return;
  }

  requestUrl.searchParams.delete('path');
  const query = requestUrl.searchParams.toString();
  request.url = `/api/${apiPath.replace(/^\/+/, '')}${query ? `?${query}` : ''}`;
  app(request, response);
}
