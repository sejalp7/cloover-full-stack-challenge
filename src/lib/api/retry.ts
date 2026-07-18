import type { AxiosError } from "axios";

export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_BASE_DELAY_MS = 300;

export function isRetryableError(error: AxiosError): boolean {
  if (!error.response) {
    return true;
  }

  const status = error.response.status;
  return status === 429 || status >= 500;
}

export function shouldRetry(error: AxiosError, attempt: number): boolean {
  return attempt < MAX_RETRY_ATTEMPTS && isRetryableError(error);
}

export function getRetryDelayMs(attempt: number): number {
  return RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
}
