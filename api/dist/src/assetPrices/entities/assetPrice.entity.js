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
exports.AssetPriceEntity = void 0;
const instance_entity_1 = require("../../common/entities/instance.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("../../assets/entities/asset.entity");
let AssetPriceEntity = class AssetPriceEntity extends instance_entity_1.InstanceEntity {
};
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], AssetPriceEntity.prototype, "from", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], AssetPriceEntity.prototype, "to", void 0);
__decorate([
    typeorm_1.Index('idx_from_to_assetprice_symbol'),
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], AssetPriceEntity.prototype, "symbol", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], AssetPriceEntity.prototype, "price", void 0);
__decorate([
    typeorm_2.ManyToOne(() => asset_entity_1.AssetEntity, (asset) => asset.assetPrices, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'from', referencedColumnName: 'symbol' }),
    __metadata("design:type", asset_entity_1.AssetEntity)
], AssetPriceEntity.prototype, "fromAsset", void 0);
__decorate([
    typeorm_2.ManyToOne(() => asset_entity_1.AssetEntity, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'to', referencedColumnName: 'symbol' }),
    __metadata("design:type", asset_entity_1.AssetEntity)
], AssetPriceEntity.prototype, "toAsset", void 0);
AssetPriceEntity = __decorate([
    typeorm_1.Entity('asset_prices'),
    typeorm_1.Unique("UQ_ASSETPRICE_FROM_TO", ["from", "to"]),
    typeorm_1.Unique("UQ_ASSETPRICE_SYMBOL", ["symbol"])
], AssetPriceEntity);
exports.AssetPriceEntity = AssetPriceEntity;
//# sourceMappingURL=assetPrice.entity.js.map