import { logger } from "@/lib/logger";

type LogFields = Record<string, unknown>;

/** Browser axios client logger — same JSON shape as server logs. */
export const apiLogger = {
  request(fields: LogFields) {
    logger.info("request", fields);
  },
  response(fields: LogFields) {
    logger.info("response", fields);
  },
  retry(fields: LogFields) {
    logger.warn("retry", fields);
  },
  error(fields: LogFields) {
    logger.error("error", fields);
  },
};
