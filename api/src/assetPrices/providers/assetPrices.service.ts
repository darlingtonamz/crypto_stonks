import { FindConditions, FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import {
  Initializer,
  Inject,
  Service,
} from 'fastify-decorators';
import axios from 'axios';
import { uniq } from 'lodash';
import { AssetPriceEntity } from '../entities/assetPrice.entity';
import { ConnectionService } from '../../db/providers/connection.service';
import { AssetsService } from '../../assets/providers/assets.service';

@Service()
export class AssetPricesService {
  private repository!: Repository<AssetPriceEntity>;

  private isSyncing = false;
  private lastSynced: number;
  
  @Inject(AssetsService)
  private assetsService!: AssetsService;

  constructor(private connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this.connectionService.connection.getRepository(AssetPriceEntity);
  }

  public async getOneAssetPrice(query: FindConditions<AssetPriceEntity>, options?: FindOneOptions): Promise<AssetPriceEntity> {
    let assetPrice: AssetPriceEntity | undefined;
    try {
      assetPrice = await this.repository.findOne(query, options);
    } catch (e) {
      throw { statusCode: 500, message: e }
    }
    if (!assetPrice) {
      throw { statusCode: 404, message: `AssetPrice ${JSON.stringify(query)} not found` }
    }
    return assetPrice;
  }

  // Get all the AssetPrices in the DB
  public async getManyAssetPrices(options: FindManyOptions<AssetPriceEntity>): Promise<AssetPriceEntity[]> {
    // TODO - Sort in ASC order with AssetPrice ID
    return this.repository.find(options);
  }

  public async syncAndUpdateAssetPrices(
    fromSymbols: string[],
    toSymbols: string[] = [],
  ): Promise<AssetPriceEntity[]> {
    let output: AssetPriceEntity[] = [];
  
    if (!this.isSyncing) {
      this.isSyncing = true;
      const now = new Date().getTime();
      console.log({
        isSyncing: this.isSyncing,
        lastSynced: this.lastSynced,
        ago: `${(now - (this.lastSynced || now)) / 1000}secs`
      })
      fromSymbols = fromSymbols.map((str) => str.trim().toUpperCase());
      toSymbols = toSymbols.map((str) => str.trim().toUpperCase());
  
      if (fromSymbols && fromSymbols.length) {
        // fallback - if there are no to symbols supplied, use the one from "from"
        if (!toSymbols || !toSymbols.length) {
          toSymbols = [...fromSymbols];
        }
      }
  
      try {
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${
          fromSymbols.join(',')
        }&tsyms=${
          toSymbols.join(',')
        }`;
    
        const result = await axios.get(url);
        const assetsMap: IAssetMap = result.data.RAW;
        const assetPriceMap: IAssetPriceMap = {};
        // console.log('%%%%%%%%%%%', { assetsMap, url })
        Object.keys(assetsMap).forEach((fromAssetKey: string) => {
          const fromAssetMap = assetsMap[fromAssetKey];
          return Object.keys(fromAssetMap).forEach((toAssetKey: string) => {
            const toAssetMap = fromAssetMap[toAssetKey];
            assetPriceMap[`${fromAssetKey}-${toAssetKey}`] = toAssetMap.PRICE;
          });
        });
        // console.log({ url, assetPriceMap, result: result.data })
        await this.cacheAssetPrices(assetPriceMap);
        output = await this.getManyAssetPrices({
          where: {
            symbol: In(Object.keys(assetPriceMap))
          }
        });
        this.lastSynced = new Date().getTime();
      } catch (error) {
        console.warn(error);
      }
      this.isSyncing = false;
    }
    // console.log('########### 1', { output })


    return output
  }

  public async fetchAndUpdateAssetPrices(
    fromSymbolsText: string = '',
    toSymbolsText: string = '',
  ): Promise<AssetPriceEntity[]> {
    const fromSymbols: string[] = fromSymbolsText.split(',').map((str) => str.trim().toUpperCase());
    const toSymbols: string[] = toSymbolsText.split(',').map((str) => str.trim().toUpperCase());

    if (fromSymbols && fromSymbols.length) {
      // fallback - if there are no to symbols supplied, use the one from "from"
      if (!toSymbols || toSymbols.length) {
        toSymbols.push(fromSymbols[0])
      }
    }

    const fromToSymbols: string[] = [];
    fromSymbols.forEach((fromSymbol) => {
      toSymbols.forEach((toSymbols) => {
        fromToSymbols.push(`${fromSymbol}-${toSymbols}`)
      })
    })
    const fetchedPrices = await this.getManyAssetPrices({
      where: {
        symbol: In(fromToSymbols)
      }
    });

    return fetchedPrices;
  }

  // upsert assets and
  // cache the prices of assets relative to other assets
  private async cacheAssetPrices(assetPriceMap: IAssetPriceMap) {
    let symbols: string[] = [];
    let fromToPriceTexts: string[] = []
    Object.keys(assetPriceMap).forEach((key) => {
      const price = assetPriceMap[key];
      const [fromKey, toKey] = key.split('-');
      symbols = uniq([...symbols, fromKey, toKey]);
      fromToPriceTexts.push(
        `'${fromKey}|${toKey}|${price}'`
      );
    });

    await this.assetsService.getAndUpsertAssetsBySymbols(symbols);
    await this.repository.query(`
      INSERT into asset_prices(symbol, "from", "to", price)
          SELECT
              (
                  (string_to_array(from_to_price_string, '|'))[1] || '-' || (string_to_array(from_to_price_string, '|'))[2]
              ) symbol,
              (string_to_array(from_to_price_string, '|'))[1] "from",
              (string_to_array(from_to_price_string, '|'))[2] "to",
              (string_to_array(from_to_price_string, '|'))[3]::NUMERIC price
          FROM (
              SELECT unnest(ARRAY[${fromToPriceTexts}]) as from_to_price_string
          ) AS pes_str
      ON CONFLICT (symbol) DO
          UPDATE SET
              price = EXCLUDED.price,
              updated_at = now()
    `);
  }
}

interface IAssetMap {
  [fromAssetKey: string]: {
    [toAssetKey: string]: {
      PRICE: number,
      [x: string]: any
    }
  }
}

interface IAssetPriceMap {
  [x: string]: number;
}
