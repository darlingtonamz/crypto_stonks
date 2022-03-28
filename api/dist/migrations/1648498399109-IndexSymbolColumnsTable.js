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
exports.IndexSymbolColumnsTable1648498399109 = void 0;
class IndexSymbolColumnsTable1648498399109 {
    constructor() {
        this.name = 'IndexSymbolColumnsTable1648498399109';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE INDEX "idx_assets_symbol" ON "assets" ("symbol") `);
            yield queryRunner.query(`CREATE INDEX "idx_from_to_assetprice_symbol" ON "asset_prices" ("symbol") `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "idx_from_to_assetprice_symbol"`);
            yield queryRunner.query(`DROP INDEX "idx_assets_symbol"`);
        });
    }
}
exports.IndexSymbolColumnsTable1648498399109 = IndexSymbolColumnsTable1648498399109;
//# sourceMappingURL=1648498399109-IndexSymbolColumnsTable.js.map