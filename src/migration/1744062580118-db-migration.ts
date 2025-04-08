import { MigrationInterface, QueryRunner } from "typeorm";

export class DbMigration1744062580118 implements MigrationInterface {
    name = 'DbMigration1744062580118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "otpCode" character varying, "expiresAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet_balance" ("id" SERIAL NOT NULL, "currency" character varying NOT NULL, "balance" numeric(18,2) NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "PK_ec31e88796415d49a1ee8d821f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "fromCurrency" character varying, "fromAmount" numeric(18,2), "toCurrency" character varying, "toAmount" numeric(18,2), "rate" numeric(18,6), "status" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet_balance" ADD CONSTRAINT "FK_7de0cb10b53fbd1181fde7d013d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "wallet_balance" DROP CONSTRAINT "FK_7de0cb10b53fbd1181fde7d013d"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "wallet_balance"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
