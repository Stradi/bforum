import type * as zod from "zod";

type ErrorFormat = {
  statusCode: number;
  message: string;
  code: string;
  action: string;
  additionalData?: unknown;
};

export class BaseError extends Error {
  constructor(private error: Partial<ErrorFormat>) {
    super();
  }

  public get statusCode() {
    return this.error.statusCode || 500;
  }

  public get message() {
    return this.error.message || "Unknown Error";
  }

  public get code() {
    return this.error.code || "UNKNOWN_ERROR";
  }

  public get action() {
    return (
      this.error.action ||
      "To be honest, I have no idea what you should do. Please wait for the me to fix it lol."
    );
  }

  public get additionalData() {
    return this.error.additionalData || null;
  }
}

export class InternalServerError extends BaseError {
  constructor(error: Error) {
    super({
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      action: "Please wait for the me to fix it lol.",
      additionalData: error.stack,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(errors: zod.ZodError) {
    super({
      message: "Request could not be validated.",
      code: "VALIDATION_ERROR",
      statusCode: 400,
      action: "Please send the same request again with a valid request body.",
      additionalData: errors.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      ),
    });
  }
}
