export type SuccessResponseData = {
  message: string;
  payload: unknown;
};

export type ErrorResponseData = {
  code: string;
  message: string;
  action?: string;
  additionalData?: unknown;
};

export type ResponseOptions = SuccessResponseData | ErrorResponseData;

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
