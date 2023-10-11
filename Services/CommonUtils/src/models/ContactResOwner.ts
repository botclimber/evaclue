export class ContactResOwner{
    id?: number;
    resOwnerId: number;
    userId: number;
    createdAt: formatTypes.dateFormat;

    constructor(resOwnerId: number, userId: number, createdAt: formatTypes.dateFormat){
        this.resOwnerId = resOwnerId;
        this.userId = userId;
        this.createdAt = createdAt;
    }
}