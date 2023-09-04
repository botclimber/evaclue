"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailToken = exports.testToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "";
const testToken = (id, type, email) => {
    const toBeSigned = (email) ? { id: id, email: email, type: type } : { id: id, type: type };
    return jsonwebtoken_1.default.sign(toBeSigned, SECRET);
};
exports.testToken = testToken;
const testEmailToken = (email) => {
    return jsonwebtoken_1.default.sign(email, SECRET);
};
exports.testEmailToken = testEmailToken;
