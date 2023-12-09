import type { ChainableMiddleware } from "../../utils/middleware";
import createMiddlewareClient from "../api/client/create-middleware-client";

const apiClientMiddleware: ChainableMiddleware = () => {
  return async (request, response) => {
    await createMiddlewareClient(request, response);
  };
};

export default apiClientMiddleware;
