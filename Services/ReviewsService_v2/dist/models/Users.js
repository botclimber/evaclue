"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
class Users {
    constructor(email, username, firstName, lastName, image, password, type, blocked, verified) {
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
exports.Users = Users;
