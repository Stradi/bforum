import type { NotFoundHandler } from "hono";
import { NotFoundError } from "../utils/errors";

export default function notFoundMiddleware(): NotFoundHandler {
  return () => {
    throw new NotFoundError();
  };
}
