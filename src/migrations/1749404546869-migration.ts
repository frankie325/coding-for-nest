import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749404546869 implements MigrationInterface {
    name = 'Migration1749404546869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`acl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_menus\` (\`menusId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_e66c7ce4d2940d236ddacba488\` (\`menusId\`), INDEX \`IDX_b465775f8f104ad3673b8d1f41\` (\`rolesId\`), PRIMARY KEY (\`menusId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`roles_menus\` ADD CONSTRAINT \`FK_e66c7ce4d2940d236ddacba4889\` FOREIGN KEY (\`menusId\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_menus\` ADD CONSTRAINT \`FK_b465775f8f104ad3673b8d1f410\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles_menus\` DROP FOREIGN KEY \`FK_b465775f8f104ad3673b8d1f410\``);
        await queryRunner.query(`ALTER TABLE \`roles_menus\` DROP FOREIGN KEY \`FK_e66c7ce4d2940d236ddacba4889\``);
        await queryRunner.query(`DROP INDEX \`IDX_b465775f8f104ad3673b8d1f41\` ON \`roles_menus\``);
        await queryRunner.query(`DROP INDEX \`IDX_e66c7ce4d2940d236ddacba488\` ON \`roles_menus\``);
        await queryRunner.query(`DROP TABLE \`roles_menus\``);
        await queryRunner.query(`DROP TABLE \`menus\``);
    }

}
