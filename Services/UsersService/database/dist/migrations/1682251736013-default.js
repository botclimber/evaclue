"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default1682251736013 = void 0;
class default1682251736013 {
    constructor() {
        this.name = 'default1682251736013';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`image\` varchar(120) NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`image\``);
    }
}
exports.default1682251736013 = default1682251736013;
