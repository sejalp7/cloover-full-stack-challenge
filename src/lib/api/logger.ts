type LogFields = Record<string, unknown>;

function format(level: "info" | "warn" | "error", message: string, fields: LogFields) {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...fields,
  };
}

export const apiLogger = {
  request(fields: LogFields) {
    console.info("[api]", format("info", "request", fields));
  },
  response(fields: LogFields) {
    console.info("[api]", format("info", "response", fields));
  },
  retry(fields: LogFields) {
    console.warn("[api]", format("warn", "retry", fields));
  },
  error(fields: LogFields) {
    console.error("[api]", format("error", "error", fields));
  },
};
