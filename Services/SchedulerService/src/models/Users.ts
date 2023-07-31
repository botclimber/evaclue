type userType = "col" | "admin" | "superAdmin" | "common"

export class Users {
    id?: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    image: string;
    password: string;
    type: userType
    blocked: boolean;
    verified: boolean;

    constructor(email: string, username: string, firstName: string, lastName: string, image: string, password:string, type: userType, blocked: boolean, verified: boolean) {
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.image = image;
        this.password = password;
        this.type = type;
        this.blocked = blocked;
        this.verified = verified;
    }
}