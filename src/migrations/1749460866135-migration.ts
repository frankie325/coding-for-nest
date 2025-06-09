import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749460866135 implements MigrationInterface {
    name = 'Migration1749460866135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menus\` CHANGE \`number\` \`path\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`menus\` DROP COLUMN \`path\``);
        await queryRunner.query(`ALTER TABLE \`menus\` ADD \`path\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menus\` DROP COLUMN \`path\``);
        await queryRunner.query(`ALTER TABLE \`menus\` ADD \`path\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`menus\` CHANGE \`path\` \`number\` varchar(255) NOT NULL`);
    }

}
