"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1648498399009 = void 0;
class InitialMigration1648498399009 {
    constructor() {
        this.name = 'InitialMigration1648498399009';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "assets" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "symbol" text NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_ASSET_SYMBOL" UNIQUE ("symbol"),
            CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id")
        )`);
            yield queryRunner.query(`CREATE TABLE "asset_prices" (
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
            yield queryRunner.query(`ALTER TABLE "asset_prices"
            ADD CONSTRAINT "FK_bdd8e1bf5b0c24d58acf12feb14"
            FOREIGN KEY ("from")
            REFERENCES "assets"("symbol") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "asset_prices"
            ADD CONSTRAINT "FK_17eb93d8176ac075264a64d1af7"
            FOREIGN KEY ("to")
            REFERENCES "assets"("symbol") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "asset_prices"`);
            yield queryRunner.query(`DROP TABLE "assets"`);
        });
    }
}
exports.InitialMigration1648498399009 = InitialMigration1648498399009;
//# sourceMappingURL=1648498399009-InitialMigration.js.map