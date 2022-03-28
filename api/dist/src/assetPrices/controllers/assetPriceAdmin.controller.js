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
exports.AssetPriceAdminController = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const assetPrices_service_1 = require("../providers/assetPrices.service");
let AssetPriceAdminController = class AssetPriceAdminController {
    constructor(service) {
        this.service = service;
    }
    getAssetPrices({ query }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.fetchAndUpdateAssetPrices(query.fsyms, query.tsyms);
        });
    }
    syncAssetPrices({ body }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('%%%%%%%%%%%', { body });
            return this.service.syncAndUpdateAssetPrices(body.from, body.to);
        });
    }
};
__decorate([
    fastify_decorators_1.GET('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetPriceAdminController.prototype, "getAssetPrices", null);
__decorate([
    fastify_decorators_1.POST('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetPriceAdminController.prototype, "syncAssetPrices", null);
AssetPriceAdminController = __decorate([
    fastify_decorators_1.Controller({ route: '/price' }),
    __metadata("design:paramtypes", [assetPrices_service_1.AssetPricesService])
], AssetPriceAdminController);
exports.AssetPriceAdminController = AssetPriceAdminController;
exports.default = AssetPriceAdminController;
//# sourceMappingURL=assetPriceAdmin.controller.js.map