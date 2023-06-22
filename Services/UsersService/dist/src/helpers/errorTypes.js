"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unauthorized = exports.NotFound = exports.BadRequest = exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ErrorHandler = ErrorHandler;
class BadRequest extends ErrorHandler {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequest = BadRequest;
class NotFound extends ErrorHandler {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFound = NotFound;
class Unauthorized extends ErrorHandler {
    constructor(message) {
        super(message, 401);
    }
}
exports.Unauthorized = Unauthorized;
