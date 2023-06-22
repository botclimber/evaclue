"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    constructor() {
        this.blocked = false;
        this.verified = false;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { unique: true, length: 60 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { unique: true, length: 30 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 30 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 120 }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 30 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 128 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 30 }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "blocked", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
User = __decorate([
    (0, typeorm_1.Entity)("Users")
], User);
exports.User = User;
