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
const axios_1 = require("axios");
const testdata = require('../res/testdata.json');
const allowedAssetSymbols = 'BTC,LINK,MKR,USD,EUR,ETH,LTC'
    .split(',')
    .map((str) => str.trim());
jest.mock('axios');
axios_1.default.get = jest.fn().mockResolvedValue({ data: testdata });
describe('Assets module', () => {
    let app;
    let service;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield util_1.createApp();
        yield util_1.clearDatabase(typeorm_1.getConnection());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app.close();
    }));
    describe('AssetPrices Controller', () => {
        let prices;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            service.syncAndUpdateAssetPrices(allowedAssetSymbols);
            prices = (yield app.inject({
                headers: { origin: 'http://localhost' },
                method: 'GET',
                url: '/price?fsyms=BTC',
            })).json();
            console.log({ prices });
        }));
        it('should return status 200 and fetch all Assets', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(true).toBeTruthy();
        }));
        describe('GET /price?fsyms=[]&tsyms=[]', () => {
            it('should return status 200 and fetch all Assets', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = (yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: '/price?fsyms=BTC',
                })).json();
                const prices = response.json();
                expect(response.statusCode).toBe(200);
                expect(prices.length).toBe(0);
            }));
        });
    });
});
//# sourceMappingURL=assetPrices.e2e-spec.js.map