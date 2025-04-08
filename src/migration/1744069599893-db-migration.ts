import { MigrationInterface, QueryRunner } from "typeorm";

export class DbMigration1744069599893 implements MigrationInterface {
    name = 'DbMigration1744069599893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_balance" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet_balance" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wallet_balance" ADD CONSTRAINT "UQ_43bc8695f8fd1ddee7ef0e8276b" UNIQUE ("userId", "currency")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_balance" DROP CONSTRAINT "UQ_43bc8695f8fd1ddee7ef0e8276b"`);
        await queryRunner.query(`ALTER TABLE "wallet_balance" ALTER COLUMN "balance" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "wallet_balance" ALTER COLUMN "balance" SET DEFAULT '0'`);
    }

}
