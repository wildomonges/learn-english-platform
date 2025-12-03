import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleColumnToUsers1764767484021 implements MigrationInterface {
  name = 'AddRoleColumnToUsers1764767484021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'student'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
