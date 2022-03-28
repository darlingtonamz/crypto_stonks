import { InstanceEntity } from "../../common/entities/instance.entity";
import {
  Entity, Column,
  JoinColumn, Index, Unique,
} from "typeorm";
import { ManyToOne } from "typeorm";
import { AssetEntity } from "../../assets/entities/asset.entity";

@Entity('asset_prices')
@Unique("UQ_ASSETPRICE_FROM_TO", ["from", "to"])
@Unique("UQ_ASSETPRICE_SYMBOL", ["symbol"])
export class AssetPriceEntity extends InstanceEntity {
  @Column({ type: 'text', nullable: false })
  from: string;

  @Column({ type: 'text', nullable: false })
  to: string;

  @Index('idx_from_to_assetprice_symbol')
  @Column({ type: 'text', nullable: false })
  public symbol: string;

  @Column({ type: 'float', nullable: false })
  public price: number;

  @ManyToOne(
    () => AssetEntity,
    (asset) => asset.assetPrices,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'from', referencedColumnName: 'symbol' })
  fromAsset: AssetEntity;

  @ManyToOne(
    () => AssetEntity,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'to', referencedColumnName: 'symbol' })
  toAsset: AssetEntity;
}