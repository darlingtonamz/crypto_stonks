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
exports.AssetsController = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const asset_dto_1 = require("../dtos/asset.dto");
const assets_service_1 = require("../providers/assets.service");
let AssetsController = class AssetsController {
    constructor(service) {
        this.service = service;
    }
    createOne({ body }, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply
                .status(201)
                .header('Content-Type', 'application/json');
            return this.service.createOneAsset(body);
        });
    }
    getManyAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getManyAssets();
        });
    }
    getAssetUsingSymbol({ params }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getAssetBySymbol(params.symbol);
        });
    }
};
__decorate([
    fastify_decorators_1.POST('/', {
        schema: {
            body: asset_dto_1.CreateAssetSchema,
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "createOne", null);
__decorate([
    fastify_decorators_1.GET('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getManyAssets", null);
__decorate([
    fastify_decorators_1.GET('/:symbol'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getAssetUsingSymbol", null);
AssetsController = __decorate([
    fastify_decorators_1.Controller({ route: '/assets' }),
    __metadata("design:paramtypes", [assets_service_1.AssetsService])
], AssetsController);
exports.AssetsController = AssetsController;
exports.default = AssetsController;
//# sourceMappingURL=assets.controller.js.map