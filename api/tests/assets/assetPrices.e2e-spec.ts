import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection, Repository } from 'typeorm';
import { AssetEntity } from '../../src/assets/entities/asset.entity';
import axios from 'axios';
import { AssetPricesService } from '../../src/assetPrices/providers/assetPrices.service';
import { ConnectionService } from '../../src/db/providers/connection.service';
import { AssetsService } from '../../src/assets/providers/assets.service';
import { AssetPriceEntity } from '../../src/assetPrices/entities/assetPrice.entity';

const testPriceData = require('../res/testdata.json');
const allowedAssetSymbols = 'BTC,LINK,MKR,USD,EUR,ETH,LTC'
  .split(',')
  .map((str) => str.trim())
jest.mock('axios');
axios.get = jest.fn().mockResolvedValue({ data: testPriceData });

describe('Assets module', () => {
  let app: FastifyInstance;
  let service: AssetPricesService;
  let assetsService: AssetsService;
  let assetsRepo: Repository<AssetEntity>;
  let assetPricesRepo: Repository<AssetPriceEntity>;

  beforeAll(async () => {
    app = await createApp();
    const connection = getConnection();
    const connectionService = new ConnectionService();
    connectionService.connection = connection;
    service = new AssetPricesService(connectionService);
    assetsService = new AssetsService(connectionService);
    assetsRepo = connection.getRepository(AssetEntity);
    assetPricesRepo = connection.getRepository(AssetPriceEntity);
    Object.defineProperty(assetsService, 'repository', { get: () => assetsRepo});
    await service.init();
    Object.defineProperty(service, 'assetsService', { get: () => assetsService});
    Object.defineProperty(service, 'repository', { get: () => assetPricesRepo});
    await clearDatabase(connection);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AssetPrices Controller', () => {
    beforeAll(async () => {
      await service.syncAndUpdateAssetPrices(allowedAssetSymbols)
      const allassets = await assetsRepo.find();
      expect(allassets.length).toEqual(allowedAssetSymbols.length);
    });

    describe('GET /price?fsyms=[]&tsyms=[]', () => {
      it('should return status 200 and fetch all Prices', async() => {
        const fsyms = [allowedAssetSymbols[0], allowedAssetSymbols[1]];
        const tsyms = [allowedAssetSymbols[2], allowedAssetSymbols[3], allowedAssetSymbols[4]];

        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: `/price?fsyms=${
            fsyms.join(',')
          }&tsyms=${
            tsyms.join(',')
          }`,
        });

        const prices = response.json();
        expect(response.statusCode).toBe(200);
        expect(prices.length).toBe(fsyms.length + (fsyms.length * tsyms.length));
        const fetchedPriceSymbols = prices.map((obj: AssetPriceEntity) => obj.symbol);

        expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${fsyms[0]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${tsyms[0]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${tsyms[1]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[0]}-${tsyms[2]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${fsyms[1]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${tsyms[0]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${tsyms[1]}`));
        expect(fetchedPriceSymbols.includes(`${fsyms[1]}-${tsyms[2]}`));
      });

      it('should return status 200 and fetch all Price even if only fsyms is set', async() => {
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: `/price?fsyms=${allowedAssetSymbols[0]}`,
        });

        const prices = response.json();
        expect(response.statusCode).toBe(200);
        expect(prices.length).toBe(1);
        expect(prices[0].symbol).toBe(`${allowedAssetSymbols[0]}-${allowedAssetSymbols[0]}`);
      });

      it('should return status 200 and when no fsyms is supplied', async() => {
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: `/price`,
        });

        const prices = response.json();
        expect(response.statusCode).toBe(200);
        expect(prices.length).toBe(0);
      });

      it('should return status 200 and when an Unknown fsyms is supplied', async() => {
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: `/price?fsyms=Unknown`,
        });

        const prices = response.json();
        expect(response.statusCode).toBe(200);
        expect(prices.length).toBe(0);
      });
    });
  });
});
