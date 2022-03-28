import {MigrationInterface, QueryRunner} from "typeorm";

export class IndexSymbolColumnsTable1648498399109 implements MigrationInterface {
    name = 'IndexSymbolColumnsTable1648498399109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_assets_symbol" ON "assets" ("symbol") `);
        await queryRunner.query(`CREATE INDEX "idx_from_to_assetprice_symbol" ON "asset_prices" ("symbol") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_from_to_assetprice_symbol"`);
        await queryRunner.query(`DROP INDEX "idx_assets_symbol"`);
    }
}
