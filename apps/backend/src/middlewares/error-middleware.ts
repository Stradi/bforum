import type { ErrorHandler } from "hono";
import { BaseError } from "../utils/errors";
import { log } from "../utils/logger";
import { resp } from "../utils/response";

export default function errorMiddleware(): ErrorHandler {
  return (error, ctx) => {
    if (error instanceof BaseError) {
      const obj = resp({
        code: error.code,
        message: error.message,
        action: error.action,
        additionalData: error.additionalData,
      });

      log.error(error);

      ctx.status(error.statusCode);
      return ctx.json(obj);
    }

    const obj = resp({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
      action: "Please wait for the me to fix it lol.",
    });

    log.fatal(error);

    ctx.status(500);
    return ctx.json(obj);
  };
}
