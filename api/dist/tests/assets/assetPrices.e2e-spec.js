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
const util_1 = require("../util");
const typeorm_1 = require("typeorm");
const asset_entity_1 = require("../../src/assets/entities/asset.entity");
const axios_1 = require("axios");
const assetPrices_service_1 = require("../../src/assetPrices/providers/assetPrices.service");
const connection_service_1 = require("../../src/db/providers/connection.service");
const assets_service_1 = require("../../src/assets/providers/assets.service");
const assetPrice_entity_1 = require("../../src/assetPrices/entities/assetPrice.entity");
const testPriceData = require('../res/testdata.json');
const allowedAssetSymbols = 'BTC,LINK,MKR,USD,EUR,ETH,LTC'
    .split(',')
    .map((str) => str.trim());
jest.mock('axios');
axios_1.default.get = jest.fn().mockResolvedValue({ data: testPriceData });
describe('Assets module', () => {
    let app;
    let service;
    let assetsService;
    let assetsRepo;
    let assetPricesRepo;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield util_1.createApp();
        const connection = typeorm_1.getConnection();
        const connectionService = new connection_service_1.ConnectionService();
        connectionService.connection = connection;
        service = new assetPrices_service_1.AssetPricesService(connectionService);
        assetsService = new assets_service_1.AssetsService(connectionService);
        assetsRepo = connection.getRepository(asset_entity_1.AssetEntity);
        assetPricesRepo = connection.getRepository(assetPrice_entity_1.AssetPriceEntity);
        Object.defineProperty(assetsService, 'repository', { get: () => assetsRepo });
        yield service.init();
        Object.defineProperty(service, 'assetsService', { get: () => assetsService });
        Object.defineProperty(service, 'repository', { get: () => assetPricesRepo });
        yield util_1.clearDatabase(connection);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app.close();
    }));
    describe('AssetPrices Controller', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield service.syncAndUpdateAssetPrices(allowedAssetSymbols);
            const allassets = yield assetsRepo.find();
            expect(allassets.length).toEqual(allowedAssetSymbols.length);
        }));
        describe('GET /price?fsyms=[]&tsyms=[]', () => {
            it('should return status 200 and fetch all Prices', () => __awaiter(void 0, void 0, void 0, function* () {
                const fsyms = [allowedAssetSymbols[0], allowedAssetSymbols[1]];
                const tsyms = [allowedAssetSymbols[2], allowedAssetSymbols[3], allowedAssetSymbols[4]];
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: `/price?fsyms=${fsyms.join(',')}&tsyms=${tsyms.join(',')}`,
                });
                const prices = response.json();
                expect(response.statusCode).toBe(200);
                expect(prices.length).toBe(fsyms.length + (fsyms.length * tsyms.length));
                const fetchedPriceSymbols = prices.map((obj) => obj.symbol);
                expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${fsyms[0]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${tsyms[0]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${tsyms[1]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${tsyms[2]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${fsyms[1]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${tsyms[0]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${tsyms[1]}`));
                expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${tsyms[2]}`));
            }));
            it('should return status 200 and fetch all Price even if only fsyms is set', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: `/price?fsyms=${allowedAssetSymbols[0]}`,
                });
                const prices = response.json();
                expect(response.statusCode).toBe(200);
                expect(prices.length).toBe(1);
                expect(prices[0].symbol).toBe(`${allowedAssetSymbols[0]}-${allowedAssetSymbols[0]}`);
            }));
            it('should return status 200 and when no fsyms is supplied', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: `/price`,
                });
                const prices = response.json();
                expect(response.statusCode).toBe(200);
                expect(prices.length).toBe(0);
            }));
            it('should return status 200 and when an Unknown fsyms is supplied', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: `/price?fsyms=Unknown`,
                });
                const prices = response.json();
                expect(response.statusCode).toBe(200);
                expect(prices.length).toBe(0);
            }));
        });
    });
});
//# sourceMappingURL=assetPrices.e2e-spec.js.map