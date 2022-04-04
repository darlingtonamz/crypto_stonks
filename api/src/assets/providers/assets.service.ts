import { FindConditions, FindOneOptions, In, Repository } from 'typeorm';
import { Initializer, Service } from 'fastify-decorators';
import { AssetEntity } from '../entities/asset.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { CreateAssetDTO } from '../dtos/asset.dto';

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
    body.symbol = body.symbol.toUpperCase();
    const existingAsset = await this.repository.findOne({ symbol: body.symbol });
    if (existingAsset) {
      throw {
        statusCode: 422,
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

  public async getAssetBySymbol(symbol: string) {
    const asset = await this.repository.findOne({
      symbol,
    });

    if (!asset) {
      throw {
        statusCode: 404,
        message: `Asset couldn't be found using symbol (${symbol})`,
      }
    }
    return asset
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
    }

    return assets;
  }
}