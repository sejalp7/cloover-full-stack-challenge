type LogLevel = "info" | "warn" | "error";
type LogFields = Record<string, unknown>;

function write(level: LogLevel, message: string, fields: LogFields = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...fields,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export const logger = {
  info(message: string, fields?: LogFields) {
    write("info", message, fields);
  },
  warn(message: string, fields?: LogFields) {
    write("warn", message, fields);
  },
  error(message: string, fields?: LogFields) {
    write("error", message, fields);
  },
};

/**
 * Per-request structured logging for App Router handlers.
 * Use once at the start of a handler; call response/error before returning.
 */
export function createRouteLogger(method: string, path: string) {
  const startedAt = Date.now();

  logger.info("request", { method, path });

  return {
    response(status: number, fields: LogFields = {}) {
      logger.info("response", {
        method,
        path,
        status,
        durationMs: Date.now() - startedAt,
        ...fields,
      });
    },
    error(error: unknown, fields: LogFields = {}) {
      logger.error("error", {
        method,
        path,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
        ...fields,
      });
    },
  };
}
