import createMiddlewareClient from "@lib/api/client/create-middleware-client";
import type { ChainableMiddleware } from "@utils/middleware";

const apiClientMiddleware: ChainableMiddleware = () => {
  return async (request, response) => {
    await createMiddlewareClient(request, response);
  };
};

export default apiClientMiddleware;
