import { FindConditions, FindOneOptions, In, Repository } from 'typeorm';
import { Initializer, Service } from 'fastify-decorators';
import { AssetEntity } from '../entities/asset.entity';
import { ConnectionService } from '../../db/providers/connection.service';
// import { endOfDay, format, parse } from 'date-fns';
import { CreateAssetDTO } from '../dtos/asset.dto';

// interface IStartEndTimeString {
//   start?: string| undefined;
//   end?: string | undefined;
// }

@Service()
export class AssetsService {
  private repository!: Repository<AssetEntity>;
  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this.connectionService.connection.getRepository(AssetEntity);
  }
  
  public async getOneAsset(query: FindConditions<AssetEntity>, options?: FindOneOptions): Promise<AssetEntity> {
    let asset: AssetEntity | undefined;
    try {
      asset = await this.repository.findOne(query, options);
    } catch (e) {
      throw { statusCode: 500, message: e }
    }
    if (!asset) {
      throw { statusCode: 404, message: `Asset ${JSON.stringify(query)} not found` }
    }
    return asset;
  }

  // Create one Asset
  public async createOneAsset(
    body: CreateAssetDTO,
  ): Promise<AssetEntity> {
    const existingAsset = await this.repository.findOne({ symbol: body.symbol });
    if (existingAsset) {
      throw {
        statusCode: 400,
        message: `Asset with the same symbol (${body.symbol}) already exists`,
      }
    }
    return this.repository.save(
      this.repository.merge(new AssetEntity(), body)
    );
  }

  public async getManyAssets(): Promise<AssetEntity[]> {
    return this.repository.find();
  }

  public async getAssetsBySymbols(symbols: string[]) {
    return this.repository.find({
      symbol: In(symbols),
    });
  }

  public async getAndUpsertAssetsBySymbols(symbols: string[]) {
    let assets = await this.getAssetsBySymbols(symbols);
    const foundSymbols = assets.map((asset) => asset.symbol);
    const missingSymbols = symbols.filter((symbol) => !foundSymbols.includes(symbol));
    if (missingSymbols && missingSymbols.length) {
      const newAssets = await this.repository.save(
        missingSymbols.map((symbol) => this.repository.merge(new AssetEntity(), { symbol }))
      )
      assets = [...assets, ...newAssets]
      console.log('||||||||||||', { assets })
    }

    return assets;
  }
}