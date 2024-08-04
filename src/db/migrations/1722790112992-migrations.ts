import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1722790112992 implements MigrationInterface {
    name = 'Migrations1722790112992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum" AS ENUM('external', 'internal')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "external_id" integer, "type" "public"."users_type_enum" NOT NULL DEFAULT 'internal', "last_name" character varying NOT NULL, "first_name" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, "avatarPath" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02140de3c599cd148edf60e154" ON "users" ("external_id", "type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_02140de3c599cd148edf60e154"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
    }

}
