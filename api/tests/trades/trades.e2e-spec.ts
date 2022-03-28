// import * as faker from 'faker';
import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection } from 'typeorm';
// import { TradeType } from '../../src/common/constants/constants';
// import { StockEntity } from '../../src/assets/entities/asset.entity';
// import { UserEntity } from '../../src/users/entities/user.entity';
// import { TradeEntity } from '../../src/assetPrices/entities/assetPrice.entity';

describe('Trades module', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await clearDatabase(getConnection());
  });

  afterAll(async () => {
    await app.close();
  });

  // describe('Trades Controller', () => {
  //   let stock: StockEntity;
  //   let user: UserEntity;

  //   beforeAll(async () => {
  //     user = (await app.inject({
  //       method: 'POST',
  //       url: '/users',
  //       payload: {
  //         "name": faker.finance.currencyCode(),
  //       }
  //     })).json();

  //     stock = (await app.inject({
  //       method: 'POST',
  //       url: '/stocks',
  //       payload: {
  //         "symbol": "ACM",
  //       }
  //     })).json();
  //   });

  //   describe('POST /trades', () => {
  //     it('should return status 201 and create Trade', async() => {
  //       const payload = {
  //         type: TradeType.BUY,
  //         user: {
  //           id: user.id,
  //           name: user.name,
  //         },
  //         symbol: stock.symbol,
  //         shares: 29,
  //         price: 140,
  //         timestamp: "2014-06-14 13:13:13"
  //       };
  //       const response = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload,
  //       });

  //       const responseJson = response.json();
  //       expect(response.statusCode).toBe(201);
  //       expect(responseJson.id).toBeTruthy();
  //       expect(responseJson.symbol).toEqual(payload.symbol);
  //       expect(responseJson.user).toEqual(payload.user);
  //       expect(responseJson.shares).toEqual(payload.shares);
  //       expect(responseJson.price).toEqual(payload.price);
  //       expect(responseJson.timestamp).toEqual(payload.timestamp);
  //     });
      
  //     it('should return status 400 with bad payload', async() => {
  //       const goodPayload = {
  //         type: TradeType.BUY,
  //         user: {
  //           id: user.id,
  //           name: user.name,
  //         },
  //         symbol: stock.symbol,
  //         shares: 29,
  //         price: 140,
  //         timestamp: "2014-06-14 13:13:13"
  //       };
  //       const response = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload: {
  //           ...goodPayload,
  //           type: 'dffddf'
  //         },
  //       });
  //       expect(response.statusCode).toBe(400);
  //     });
      
  //     it('should return status 404 with non-existent entity references', async() => {
  //       const goodPayload = {
  //         type: TradeType.BUY,
  //         user: {
  //           id: user.id,
  //           name: user.name,
  //         },
  //         symbol: stock.symbol,
  //         shares: 29,
  //         price: 140,
  //         timestamp: "2014-06-14 13:13:13"
  //       };

  //       const response = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload: {
  //           ...goodPayload,
  //           symbol: 'NON-EXISTENT-SYMBOL',
  //         },
  //       });
  //       expect(response.statusCode).toBe(404);
        
  //       const response2 = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload: {
  //           ...goodPayload,
  //           user: {
  //             id: faker.datatype.uuid(),
  //           }
  //         },
  //       });
  //       expect(response2.statusCode).toBe(404);
  //     });
  //   });

  //   describe('GET /trades', () => {
  //     it('should return status 200 and return many Trade', async() => {
  //       const existingTrades = (await app.inject({
  //         method: 'GET',
  //         url: '/trades',
  //       })).json();

  //       const payload = {
  //         type: TradeType.BUY,
  //         user: {
  //           id: user.id,
  //           name: user.name,
  //         },
  //         symbol: stock.symbol,
  //         shares: 29,
  //         price: 140,
  //         timestamp: "2014-06-14 13:13:13"
  //       };
  //       // Create more Trade
  //       await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload,
  //       });

  //       const tradesCount = (await app.inject({
  //         method: 'GET',
  //         url: '/trades',
  //       })).json().length;
  //       expect(tradesCount).toEqual(existingTrades.length + 1);
  //     });
  //   });

  //   describe('GET /trades/:id', () => {
  //     let createdTrade: TradeEntity;

  //     beforeAll(async () => {        
  //       const payload = {
  //         type: TradeType.BUY,
  //         user: {
  //           id: user.id,
  //           name: user.name,
  //         },
  //         symbol: stock.symbol,
  //         shares: 29,
  //         price: 140,
  //         timestamp: "2014-06-14 13:13:13"
  //       };
  //       // Create more Trade
  //       createdTrade = (await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload,
  //       })).json();
  //     });

  //     it('should return status 200 and return one Trade', async() => {
  //       const fetchedTrade = (await app.inject({
  //         method: 'GET',
  //         url: `/trades/${createdTrade.id}`,
  //       })).json();
  //       expect(fetchedTrade.id).toEqual(createdTrade.id);
  //       expect(fetchedTrade.symbol).toEqual(createdTrade.symbol);
  //     });

  //     it('should return status 404, when non-existent trade_id is passed', async() => {
  //       const response = await app.inject({
  //         method: 'GET',
  //         url: `/trades/${faker.datatype.uuid()}`,
  //       });
        
  //       expect(response.statusCode).toBe(404);
  //     });
  //   });

  //   describe('GET /trades/users/:user_id', () => {
  //     it('should return status 200 and return many Trade belonging to user', async() => {
  //       const newUser = (await app.inject({
  //         method: 'POST',
  //         url: '/users',
  //         payload: {
  //           "name": faker.finance.currencyCode(),
  //         }
  //       })).json();

  //       const externalUser = (await app.inject({
  //         method: 'POST',
  //         url: '/users',
  //         payload: {
  //           "name": faker.finance.currencyCode(),
  //         }
  //       })).json();

  //       const newStock = (await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           "symbol": faker.finance.currencyCode().toUpperCase(),
  //         }
  //       })).json();
        
  //       // Create external user Trade
  //       let response = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload: {
  //           type: TradeType.BUY,
  //           user: {
  //             id: externalUser.id,
  //             name: externalUser.name,
  //           },
  //           symbol: stock.symbol,
  //           shares: 29,
  //           price: 140,
  //           timestamp: "2014-06-14 13:13:13"
  //         },
  //       });
  //       expect(response.statusCode).toBe(201);

  //       // external trades count should be more than 0
  //       let externalTrades = (await app.inject({
  //         method: 'GET',
  //         url: `/trades`,
  //       })).json();
  //       expect(externalTrades.length > 0).toEqual(true);

  //       // user trades count should be 0
  //       let userTrades = (await app.inject({
  //         method: 'GET',
  //         url: `/trades/users/${newUser.id}`,
  //       })).json();
        
  //       expect(userTrades.length).toEqual(0);
        
  //       // Create first user Trade
  //       response = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload: {
  //           type: TradeType.BUY,
  //           user: {
  //             id: newUser.id,
  //             name: newUser.name,
  //           },
  //           symbol: newStock.symbol,
  //           shares: 29,
  //           price: 140,
  //           timestamp: "2014-06-14 13:13:13"
  //         },
  //       });
  //       expect(response.statusCode).toBe(201);

  //       // Create second user Trade
  //       response = await app.inject({
  //         method: 'POST',
  //         url: '/trades',
  //         payload: {
  //           type: TradeType.BUY,
  //           user: {
  //             id: newUser.id,
  //             name: newUser.name,
  //           },
  //           symbol: newStock.symbol,
  //           shares: 13,
  //           price: 150,
  //           timestamp: "2014-06-14 13:13:13"
  //         },
  //       });
  //       expect(response.statusCode).toBe(201);
        
  //       userTrades = (await app.inject({
  //         method: 'GET',
  //         url: `/trades/users/${newUser.id}`,
  //       })).json();
        
  //       expect(userTrades.length).toEqual(2);
  //     });
  //   });

  //   describe('DELETE /erase', () => {
  //     it('should return status 200 and return all Trade', async() => {
  //       // create more trades
  //       for (let i = 0; i < 5; i++) {
  //         const response = await app.inject({
  //           method: 'POST',
  //           url: '/trades',
  //           payload: {
  //             type: TradeType.BUY,
  //             user: {
  //               id: user.id,
  //               name: user.name,
  //             },
  //             symbol: stock.symbol,
  //             shares: 13,
  //             price: 150,
  //             timestamp: "2014-06-14 13:13:13"
  //           },
  //         });
  //         expect(response.statusCode).toBe(201);
  //       }

  //       // Trades count should be more than 0
  //       let trades = (await app.inject({
  //         method: 'GET',
  //         url: `/trades`,
  //       })).json();
  //       expect(trades.length > 0).toEqual(true);

  //       let response = await app.inject({
  //         method: 'DELETE',
  //         url: '/erase',
  //       });
  //       expect(response.statusCode).toBe(200);

  //       // Trades count should be = 0
  //       trades = (await app.inject({
  //         method: 'GET',
  //         url: `/trades`,
  //       })).json();
  //       expect(trades.length).toEqual(0);
  //     });
  //   });
  // });
});
