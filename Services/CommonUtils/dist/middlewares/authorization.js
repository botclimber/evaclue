"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthz = void 0;
const isAuthz = (uType) => {
    const cols = ["col", "admin", "superAdmin"];
    return cols.includes(uType);
};
exports.isAuthz = isAuthz;
