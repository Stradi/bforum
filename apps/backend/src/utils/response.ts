import type { Context } from "hono";

type ResponseType = Promise<Response> | Response;

type SuccessResponseData = {
  message: string;
  payload: unknown;
};

type ErrorResponseData = {
  code: string;
  message: string;
  action?: string;
  additionalData?: unknown;
};

type ResponseOptions = SuccessResponseData | ErrorResponseData;

function isErrorResponse(
  options: ResponseOptions
): options is ErrorResponseData {
  return Object.prototype.hasOwnProperty.call(options, "code");
}

export function resp(options: ResponseOptions) {
  if (isErrorResponse(options)) {
    return {
      success: false,
      data: null,
      error: options,
    };
  }

  return {
    success: true,
    data: options,
    error: null,
  };
}

export function ok(
  ctx: Context,
  additionalData?: SuccessResponseData
): ResponseType {
  const obj = resp({
    message: additionalData?.message ?? "OK",
    payload: additionalData?.payload ?? null,
  });

  ctx.status(200);
  return ctx.json(obj);
}

export function created(
  ctx: Context,
  additionalData?: SuccessResponseData
): ResponseType {
  const obj = resp({
    message: additionalData?.message ?? "Created",
    payload: additionalData?.payload ?? null,
  });

  ctx.status(201);
  return ctx.json(obj);
}

export function noContent(ctx: Context): ResponseType {
  ctx.status(204);
  return ctx.text("");
}

export function badRequest(
  ctx: Context,
  additionalData?: ErrorResponseData
): ResponseType {
  const obj = resp({
    code: additionalData?.code ?? "BAD_REQUEST",
    message: additionalData?.message ?? "Bad Request",
    action: additionalData?.action ?? undefined,
    additionalData: additionalData?.additionalData ?? undefined,
  });

  ctx.status(400);
  return ctx.json(obj);
}

export function notAllowed(
  ctx: Context,
  additionalData?: ErrorResponseData
): ResponseType {
  const obj = resp({
    code: additionalData?.code ?? "NOT_ALLOWED",
    message: additionalData?.message ?? "Not Allowed",
    action: additionalData?.action ?? undefined,
    additionalData: additionalData?.additionalData ?? undefined,
  });

  ctx.status(405);
  return ctx.json(obj);
}

export function notFound(
  ctx: Context,
  additionalData?: ErrorResponseData
): ResponseType {
  const obj = resp({
    code: additionalData?.code ?? "NOT_FOUND",
    message: additionalData?.message ?? "Not Found",
    action: additionalData?.action ?? undefined,
    additionalData: additionalData?.additionalData ?? undefined,
  });

  ctx.status(404);
  return ctx.json(obj);
}

export function internalServerError(
  ctx: Context,
  additionalData?: ErrorResponseData
): ResponseType {
  const obj = resp({
    code: additionalData?.code ?? "INTERNAL_SERVER_ERROR",
    message: additionalData?.message ?? "Internal Server Error",
    action: additionalData?.action ?? undefined,
    additionalData: additionalData?.additionalData ?? undefined,
  });

  ctx.status(500);
  return ctx.json(obj);
}
