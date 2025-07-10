import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSql1752162128308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
INSERT INTO public.app_config ("createdAt", "createdUser", "updatedAt", "updatedUser", "name", description, value, "type") VALUES('2025-07-08 17:32:55.578', 0, '2025-07-08 17:32:55.578', 0, 'WHITELIST_USER', 'WHITELIST_USER', '["quangkhoi1228@gmail.com", "test1@gmail.com", "nntannguyen179@gmail.com"]', 'array');
INSERT INTO public.app_config ("createdAt", "createdUser", "updatedAt", "updatedUser", "name", description, value, "type") VALUES('2025-07-08 17:32:55.578', 0, '2025-07-08 17:32:55.578', 0, 'TAX', 'TAX', '0.001', 'number');
INSERT INTO public.app_config ("createdAt", "createdUser", "updatedAt", "updatedUser", "name", description, value, "type") VALUES('2025-07-08 17:32:55.578', 0, '2025-07-08 17:32:55.578', 0, 'FEE', 'FEE', '0.001', 'number');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
