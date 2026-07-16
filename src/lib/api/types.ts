import type { AxiosRequestConfig } from "axios";

export type RetryAxiosRequestConfig = AxiosRequestConfig & {
  metadata?: {
    startTime: number;
    attempt: number;
  };
};
