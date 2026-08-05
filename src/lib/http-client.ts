export interface HttpClientOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
}

export class HttpError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(message: string, status: number, statusText: string, data?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export async function fetchWithRetry<T>(
  url: string,
  options: HttpClientOptions = {}
): Promise<T> {
  const {
    timeoutMs = 15000,
    retries = 2,
    backoffMs = 1000,
    headers,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      const isAbortError = error instanceof Error && error.name === 'AbortError';
      const isLastAttempt = attempt >= retries;

      if (isLastAttempt) {
        if (isAbortError) {
          throw new HttpError(`Request timed out after ${timeoutMs}ms`, 408, 'Request Timeout');
        }
        if (error instanceof HttpError) {
          throw error;
        }
        throw new HttpError(
          error instanceof Error ? error.message : 'Network request failed',
          500,
          'Internal Request Failure'
        );
      }

      // Exponential backoff delay before retrying
      const delay = backoffMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw new HttpError('Request failed after max retries', 500, 'Max Retries Exceeded');
}
