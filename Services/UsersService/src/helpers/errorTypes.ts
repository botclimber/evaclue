export class ErrorHandler extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends ErrorHandler {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFound extends ErrorHandler {
  constructor(message: string) {
    super(message, 404);
  }
}

export class Unauthorized extends ErrorHandler {
  constructor(message: string) {
    super(message, 401);
  }
}
