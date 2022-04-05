import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection } from 'typeorm';
import { AssetEntity } from '../../src/assets/entities/asset.entity';

describe('Assets module', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await clearDatabase(getConnection());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Assets Controller', () => {
    let asset: AssetEntity;

    beforeAll(async () => {
      asset = (await app.inject({
        headers: { origin: 'http://localhost' },
        method: 'POST',
        url: '/assets',
        payload: {
          "symbol": 'BTC',
        },
      })).json();
    });

    describe('POST /assets', () => {
      it('should return status 201 and create Asset', async() => {
        const payload = {
          "symbol": 'ETH',
        };
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'POST',
          url: '/assets',
          payload
        });

        const responseJson = response.json();
        expect(response.statusCode).toBe(201);
        expect(responseJson.id).toBeTruthy();
        expect(responseJson.symbol).toEqual(payload.symbol);
      });

      it('should return status 422 and not create existing Asset', async() => {
        const payload = {
          "symbol": 'ETH',
        };
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'POST',
          url: '/assets',
          payload
        });

        expect(response.statusCode).toBe(422);
      });
    });

    describe('GET /assets', () => {
      it('should return status 200 and fetch all Assets', async() => {
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: '/assets',
        });

        const responseJson = response.json();
        expect(response.statusCode).toBe(200);
        expect(responseJson.length > 1).toBe(true);
        const foundAsset = responseJson.find((obj: AssetEntity) => obj.symbol === asset.symbol);
        expect(foundAsset.id === asset.id).toBe(true);
      });

      it('should return status 200 and fetch Asset using symbol', async() => {
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: `/assets/${asset.symbol}`,
        });

        const responseJson = response.json();
        expect(response.statusCode).toBe(200);
        expect(responseJson.id === asset.id).toBe(true);
      });

      it('should return status 404 and fetch Asset using unknown symbol', async() => {
        const response = await app.inject({
          headers: { origin: 'http://localhost' },
          method: 'GET',
          url: `/assets/UNK`,
        });

        expect(response.statusCode).toBe(404);
      });
    });
  });
});
