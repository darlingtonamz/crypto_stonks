import { InstanceEntity } from "../../common/entities/instance.entity";
import { Entity, Column, OneToMany, Unique, Index } from "typeorm";
import { AssetPriceEntity } from "../../assetPrices/entities/assetPrice.entity";

@Entity('assets')
@Unique("UQ_ASSET_SYMBOL", ["symbol"])
export class AssetEntity extends InstanceEntity {
  @Index('idx_assets_symbol')
  @Column({ type: 'text', nullable: false })
  public symbol: string;

  @OneToMany(
    () => AssetPriceEntity,
    (assetPrice) => assetPrice.fromAsset,
  )
  assetPrices: AssetPriceEntity[];
}
