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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetEntity = void 0;
const instance_entity_1 = require("../../common/entities/instance.entity");
const typeorm_1 = require("typeorm");
const assetPrice_entity_1 = require("../../assetPrices/entities/assetPrice.entity");
let AssetEntity = class AssetEntity extends instance_entity_1.InstanceEntity {
};
__decorate([
    typeorm_1.Index('idx_assets_symbol'),
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], AssetEntity.prototype, "symbol", void 0);
__decorate([
    typeorm_1.OneToMany(() => assetPrice_entity_1.AssetPriceEntity, (assetPrice) => assetPrice.fromAsset),
    __metadata("design:type", Array)
], AssetEntity.prototype, "assetPrices", void 0);
AssetEntity = __decorate([
    typeorm_1.Entity('assets'),
    typeorm_1.Unique("UQ_ASSET_SYMBOL", ["symbol"])
], AssetEntity);
exports.AssetEntity = AssetEntity;
//# sourceMappingURL=asset.entity.js.map