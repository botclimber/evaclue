"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ?? if left value is null or undefined || is left value is false
const SECRET = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "";
function tokenHandler(req) {
    return new Promise((r, e) => {
        const tokenFromQuery = req.query.token;
        const tokenFromHeader = () => {
            const header = req.headers['authorization'];
            if (header)
                return header.split(" ")[1];
            return undefined;
        };
        const token = (tokenFromQuery) ? tokenFromQuery : tokenFromHeader;
        if (token) {
            jsonwebtoken_1.default.verify(token, SECRET, (err, decoded) => {
                if (err)
                    e({ statusCode: 400, msg: 'Failed to auth token' });
                if (!(decoded.id && decoded.type && decoded.email))
                    e({ statusCode: 400, msg: 'missing required keys' });
                r(Object.assign({}, req.body, decoded));
            });
        }
        else
            e({ statusCode: 401, msg: 'authorization must exist in headers' });
    });
}
exports.tokenHandler = tokenHandler;
