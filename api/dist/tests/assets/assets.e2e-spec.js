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
describe('Assets module', () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield util_1.createApp();
        yield util_1.clearDatabase(typeorm_1.getConnection());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app.close();
    }));
    describe('Assets Controller', () => {
        let asset;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            asset = (yield app.inject({
                headers: { origin: 'http://localhost' },
                method: 'POST',
                url: '/assets',
                payload: {
                    "symbol": 'BTC',
                },
            })).json();
        }));
        describe('POST /assets', () => {
            it('should return status 201 and create Asset', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    "symbol": 'ETH',
                };
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'POST',
                    url: '/assets',
                    payload
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(201);
                expect(responseJson.id).toBeTruthy();
                expect(responseJson.symbol).toEqual(payload.symbol);
            }));
            it('should return status 422 and not create existing Asset', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    "symbol": 'ETH',
                };
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'POST',
                    url: '/assets',
                    payload
                });
                expect(response.statusCode).toBe(422);
            }));
        });
        describe('GET /assets', () => {
            it('should return status 200 and fetch all Assets', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: '/assets',
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(200);
                expect(responseJson.length > 1).toBe(true);
                const foundAsset = responseJson.find((obj) => obj.symbol === asset.symbol);
                expect(foundAsset.id === asset.id).toBe(true);
            }));
            it('should return status 200 and fetch Asset using symbol', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: `/assets/${asset.symbol}`,
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(200);
                expect(responseJson.id === asset.id).toBe(true);
            }));
            it('should return status 404 and fetch Asset using unknown symbol', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield app.inject({
                    headers: { origin: 'http://localhost' },
                    method: 'GET',
                    url: `/assets/UNK`,
                });
                expect(response.statusCode).toBe(404);
            }));
        });
    });
});
//# sourceMappingURL=assets.e2e-spec.js.map