"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenReader = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function tokenReader(token) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.tokenReader = tokenReader;
