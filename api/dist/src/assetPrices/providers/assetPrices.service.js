"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AssetPricesService = void 0;
const typeorm_1 = require("typeorm");
const fastify_decorators_1 = require("fastify-decorators");
const axios_1 = require("axios");
const lodash_1 = require("lodash");
const assetPrice_entity_1 = require("../entities/assetPrice.entity");
const connection_service_1 = require("../../db/providers/connection.service");
const assets_service_1 = require("../../assets/providers/assets.service");
let AssetPricesService = class AssetPricesService {
    constructor(connectionService) {
        this.connectionService = connectionService;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.repository = this.connectionService.connection.getRepository(assetPrice_entity_1.AssetPriceEntity);
        });
    }
    getOneAssetPrice(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let assetPrice;
            try {
                assetPrice = yield this.repository.findOne(query, options);
            }
            catch (e) {
                throw { statusCode: 500, message: e };
            }
            if (!assetPrice) {
                throw { statusCode: 404, message: `AssetPrice ${JSON.stringify(query)} not found` };
            }
            return assetPrice;
        });
    }
    getManyAssetPrices(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find(options);
        });
    }
    syncAndUpdateAssetPrices(fromSymbols, toSymbols) {
        return __awaiter(this, void 0, void 0, function* () {
            fromSymbols = fromSymbols.map((str) => str.trim().toUpperCase());
            toSymbols = toSymbols.map((str) => str.trim().toUpperCase());
            if (fromSymbols && fromSymbols.length) {
                if (!toSymbols || !toSymbols.length) {
                    toSymbols = [...fromSymbols];
                }
            }
            let output;
            try {
                const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromSymbols.join(',')}&tsyms=${toSymbols.join(',')}`;
                const result = yield axios_1.default.get(url);
                const assetsMap = result.data.RAW;
                const assetPriceMap = {};
                Object.keys(assetsMap).forEach((fromAssetKey) => {
                    const fromAssetMap = assetsMap[fromAssetKey];
                    return Object.keys(fromAssetMap).forEach((toAssetKey) => {
                        const toAssetMap = fromAssetMap[toAssetKey];
                        assetPriceMap[`${fromAssetKey}-${toAssetKey}`] = toAssetMap.PRICE;
                    });
                });
                yield this.cacheAssetPrices(assetPriceMap);
                output = yield this.getManyAssetPrices({
                    where: {
                        symbol: typeorm_1.In(Object.keys(assetPriceMap))
                    }
                });
                ;
            }
            catch (error) {
                console.warn(error);
            }
            return output;
        });
    }
    fetchAndUpdateAssetPrices(fromSymbolsText = '', toSymbolsText = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const fromSymbols = fromSymbolsText.split(',').map((str) => str.trim().toUpperCase());
            const toSymbols = toSymbolsText.split(',').map((str) => str.trim().toUpperCase());
            if (fromSymbols && fromSymbols.length) {
                if (!toSymbols || toSymbols.length) {
                    toSymbols.push(fromSymbols[0]);
                }
            }
            const fromToSymbols = [];
            fromSymbols.forEach((fromSymbol) => {
                toSymbols.forEach((toSymbols) => {
                    fromToSymbols.push(`${fromSymbol}-${toSymbols}`);
                });
            });
            const fetchedPrices = yield this.getManyAssetPrices({
                where: {
                    symbol: typeorm_1.In(fromToSymbols)
                }
            });
            return fetchedPrices;
        });
    }
    cacheAssetPrices(assetPriceMap) {
        return __awaiter(this, void 0, void 0, function* () {
            let symbols = [];
            let fromToPriceTexts = [];
            Object.keys(assetPriceMap).forEach((key) => {
                const price = assetPriceMap[key];
                const [fromKey, toKey] = key.split('-');
                symbols = lodash_1.uniq([...symbols, fromKey, toKey]);
                fromToPriceTexts.push(`'${fromKey}|${toKey}|${price}'`);
            });
            yield this.assetsService.getAndUpsertAssetsBySymbols(symbols);
            yield this.repository.query(`
      INSERT into asset_prices(symbol, "from", "to", price)
          SELECT
              (
                  (string_to_array(from_to_price_string, '|'))[1] || '-' || (string_to_array(from_to_price_string, '|'))[2]
              ) symbol,
              (string_to_array(from_to_price_string, '|'))[1] "from",
              (string_to_array(from_to_price_string, '|'))[2] "to",
              (string_to_array(from_to_price_string, '|'))[3]::NUMERIC price
          FROM (
              SELECT unnest(ARRAY[${fromToPriceTexts}]) as from_to_price_string
          ) AS pes_str
      ON CONFLICT (symbol) DO
          UPDATE SET
              price = EXCLUDED.price,
              updated_at = now()
    `);
        });
    }
};
__decorate([
    fastify_decorators_1.Inject(assets_service_1.AssetsService),
    __metadata("design:type", assets_service_1.AssetsService)
], AssetPricesService.prototype, "assetsService", void 0);
__decorate([
    fastify_decorators_1.Initializer([connection_service_1.ConnectionService]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetPricesService.prototype, "init", null);
AssetPricesService = __decorate([
    fastify_decorators_1.Service(),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService])
], AssetPricesService);
exports.AssetPricesService = AssetPricesService;
//# sourceMappingURL=assetPrices.service.js.map