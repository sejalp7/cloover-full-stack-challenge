import axios, { type AxiosError, type AxiosInstance } from "axios";
import { apiLogger } from "./logger";
import { getRetryDelayMs, shouldRetry } from "./retry";
import type { RetryAxiosRequestConfig } from "./types";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15_000,
  });

  client.interceptors.request.use((config) => {
    const retryConfig = config as RetryAxiosRequestConfig;
    retryConfig.metadata = {
      startTime: Date.now(),
      attempt: retryConfig.metadata?.attempt ?? 1,
    };

    apiLogger.request({
      method: (config.method ?? "get").toUpperCase(),
      url: `${config.baseURL ?? ""}${config.url ?? ""}`,
      attempt: retryConfig.metadata.attempt,
    });

    return config;
  });

  client.interceptors.response.use(
    (response) => {
      const config = response.config as RetryAxiosRequestConfig;
      const durationMs = config.metadata
        ? Date.now() - config.metadata.startTime
        : undefined;

      apiLogger.response({
        method: (config.method ?? "get").toUpperCase(),
        url: `${config.baseURL ?? ""}${config.url ?? ""}`,
        status: response.status,
        attempt: config.metadata?.attempt ?? 1,
        durationMs,
      });

      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as RetryAxiosRequestConfig | undefined;
      if (!config) {
        apiLogger.error({ message: error.message });
        return Promise.reject(error);
      }

      const attempt = config.metadata?.attempt ?? 1;
      const durationMs = config.metadata
        ? Date.now() - config.metadata.startTime
        : undefined;

      apiLogger.error({
        method: (config.method ?? "get").toUpperCase(),
        url: `${config.baseURL ?? ""}${config.url ?? ""}`,
        status: error.response?.status,
        attempt,
        durationMs,
        message: error.message,
      });

      if (!shouldRetry(error, attempt)) {
        return Promise.reject(error);
      }

      const nextAttempt = attempt + 1;
      const delayMs = getRetryDelayMs(attempt);

      apiLogger.retry({
        method: (config.method ?? "get").toUpperCase(),
        url: `${config.baseURL ?? ""}${config.url ?? ""}`,
        nextAttempt,
        delayMs,
        status: error.response?.status,
      });

      await sleep(delayMs);

      config.metadata = {
        startTime: Date.now(),
        attempt: nextAttempt,
      };

      return client.request(config);
    },
  );

  return client;
}

export const apiClient = createApiClient();
export default apiClient;
