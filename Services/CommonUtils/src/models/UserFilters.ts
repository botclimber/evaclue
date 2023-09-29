export class UserFilters {
    id?: number
    userId: number;
    byCities: string;
    byRentPriceMin: number;
    byRentPriceMax: number;
    enable: boolean;

    constructor(userId: number, byCities: string, byRentPriceMin: number, byRentPriceMax: number, enable: boolean){
        this.userId = userId;
        this.byCities = byCities;
        this.byRentPriceMin = byRentPriceMin;
        this.byRentPriceMax = byRentPriceMax;
        this.enable = enable;

    }
}