"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilters = void 0;
class UserFilters {
    constructor(userId, byCities, byRentPriceMin, byRentPriceMax, enable) {
        this.userId = userId;
        this.byCities = byCities;
        this.byRentPriceMin = byRentPriceMin;
        this.byRentPriceMax = byRentPriceMax;
        this.enable = enable;
    }
}
exports.UserFilters = UserFilters;
