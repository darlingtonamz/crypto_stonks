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
var AssetPriceRefreshScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_decorators_1 = require("fastify-decorators");
const assetPrices_service_1 = require("../assetPrices/providers/assetPrices.service");
const toad_scheduler_1 = require("toad-scheduler");
const configuration_1 = require("../config/configuration");
const { allowedAssetSymbols, priceRefreshDelayInSecond } = configuration_1.default();
let AssetPriceRefreshScheduler = AssetPriceRefreshScheduler_1 = class AssetPriceRefreshScheduler {
    constructor() {
        this.isRunning = false;
        if (!AssetPriceRefreshScheduler_1._instance) {
            AssetPriceRefreshScheduler_1._instance = this;
        }
        else {
            return AssetPriceRefreshScheduler_1._instance;
        }
    }
    start(server) {
        if (!this.isRunning) {
            const task = new toad_scheduler_1.AsyncTask('simple task', () => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.service.syncAndUpdateAssetPrices(allowedAssetSymbols);
                this.pricesUpdatedAt = new Date().getTime();
                console.info(`(${result.length}) PRICE(S) UPDATED !!!!!!!!!!!`);
                server.websocketServer.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({
                            message: 'ASSET_PRICE_UPDATED',
                        }));
                    }
                });
                return Promise.resolve();
            }), (err) => { console.error(err); });
            const job = new toad_scheduler_1.SimpleIntervalJob({ seconds: priceRefreshDelayInSecond, }, task);
            server.ready().then(() => {
                console.log('fastify.ready(), successfully booted!');
                server.scheduler.addSimpleIntervalJob(job);
                this.isRunning = true;
            }, (err) => {
                console.log('an error happened', err);
            });
        }
    }
};
__decorate([
    fastify_decorators_1.Inject(assetPrices_service_1.AssetPricesService),
    __metadata("design:type", assetPrices_service_1.AssetPricesService)
], AssetPriceRefreshScheduler.prototype, "service", void 0);
AssetPriceRefreshScheduler = AssetPriceRefreshScheduler_1 = __decorate([
    fastify_decorators_1.Controller(),
    __metadata("design:paramtypes", [])
], AssetPriceRefreshScheduler);
exports.default = AssetPriceRefreshScheduler;
//# sourceMappingURL=AssetPriceRefreshScheduler.js.map