export class UserFilter {
    userName: string;
    userId: number;
    userEmail: string;
    byCities: string;
    byRentPriceMin: number;
    byRentPriceMax: number;
    enable: boolean;

    constructor(userName: string, userId: number, userEmail: string, byCities: string, byRentPriceMin: number, byRentPriceMax: number, enable: boolean){

        this.userName = userName;
        this.userId = userId;
        this.userEmail = userEmail;
        this.byCities = byCities;
        this.byRentPriceMin = byRentPriceMin;
        this.byRentPriceMax = byRentPriceMax;
        this.enable = enable;

    }
}