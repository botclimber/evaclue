import { MigrationInterface, QueryRunner } from "typeorm";

export class default1682251736013 implements MigrationInterface {
    name = 'default1682251736013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`image\` varchar(120) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`image\``);
    }

}
