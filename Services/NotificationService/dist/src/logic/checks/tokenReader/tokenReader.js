"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenReader = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function tokenReader(token) {
    var _a;
    try {
        const result = jsonwebtoken_1.default.verify(token, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "", (err, data) => {
            if (err) {
                console.log(err);
                throw "invalid token";
            }
            else
                return data;
        });
        return result;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}
exports.tokenReader = tokenReader;
