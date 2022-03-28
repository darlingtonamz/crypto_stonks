import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1648498399009 implements MigrationInterface {
    name = 'InitialMigration1648498399009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assets" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "symbol" text NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_ASSET_SYMBOL" UNIQUE ("symbol"),
            CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`CREATE TABLE "asset_prices" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "from" text NOT NULL,
            "to" text NOT NULL,
            "symbol" text NOT NULL,
            "price" double precision NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_ASSETPRICE_FROM_TO" UNIQUE ("from", "to"),
            CONSTRAINT "UQ_ASSETPRICE_SYMBOL" UNIQUE ("symbol"),
            CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id")
        )`);
        await queryRunner.query(`ALTER TABLE "asset_prices"
            ADD CONSTRAINT "FK_bdd8e1bf5b0c24d58acf12feb14"
            FOREIGN KEY ("from")
            REFERENCES "assets"("symbol") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_prices"
            ADD CONSTRAINT "FK_17eb93d8176ac075264a64d1af7"
            FOREIGN KEY ("to")
            REFERENCES "assets"("symbol") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "asset_prices"`);
        await queryRunner.query(`DROP TABLE "assets"`);
    }
}
