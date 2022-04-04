// import * as faker from 'faker';
import { FastifyInstance } from 'fastify';
import {
  clearDatabase,
  createApp
} from "../util";
import { getConnection } from 'typeorm';

describe('Assets module', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
    await clearDatabase(getConnection());
  });

  afterAll(async () => {
    await app.close();
  });

  // describe('Stocks Controller', () => {
  //   let user: UserEntity;

  //   beforeAll(async () => {
  //     user = (await app.inject({
  //       method: 'POST',
  //       url: '/users',
  //       payload: {
  //         "name": faker.finance.currencyCode(),
  //       }
  //     })).json();
  //   });

  //   describe('POST /stocks', () => {
  //     it('should return status 201 and create Stock', async() => {
  //       const payload = {
  //         symbol: faker.finance.currencyCode().toUpperCase(),
  //       };
  //       const response = await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload,
  //       });

  //       const responseJson = response.json();
  //       expect(response.statusCode).toBe(201);
  //       expect(responseJson.id).toBeTruthy();
  //       expect(responseJson.symbol).toEqual(payload.symbol);
  //     });

  //     it('should return status 400 and not create Stock with existing symbol', async() => {
  //       const payload = {
  //         symbol: faker.finance.currencyCode().toUpperCase(),
  //       };
  //       let response = await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload,
  //       });
  //       const exisitngStock = response.json();
  //       expect(response.statusCode).toBe(201);

  //       response = await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           symbol: exisitngStock.symbol,
  //         },
  //       });
  //       expect(response.statusCode).toBe(400);
  //     });
      
  //     it('should return status 400 with bad payload', async() => {
  //       const goodPayload = {
  //         symbol: faker.finance.currencyCode().toUpperCase(),
  //       };

  //       const response = await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           ...goodPayload,
  //           symbol: 'bad-symbol'
  //         },
  //       });
  //       expect(response.statusCode).toBe(400);
  //     });
  //   });

  //   describe('GET /stocks/:stock_symbol/price', () => {
  //     it('should return status 200 and return many Stock Price', async() => {
  //       const myStock = (await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           symbol: faker.finance.currencyCode().toUpperCase(),
  //         }
  //       })).json();

  //       const loneStock = (await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           symbol: faker.finance.currencyCode().toUpperCase(),
  //         }
  //       })).json();

  //       // stock timestamp 2014-06-12 - 2014-06-15
  //       let tradePayloads = [
  //         {
  //           price: 190,
  //           timestamp: "2014-06-12 13:13:13"
  //         },
  //         {
  //           price: 140,
  //           timestamp: "2014-06-13 13:13:13"
  //         },
  //         {
  //           price: 170,
  //           timestamp: "2014-06-14 13:13:13"
  //         },
  //         {
  //           price: 135,
  //           timestamp: "2014-06-14 13:13:13"
  //         },
  //         {
  //           price: 180,
  //           timestamp: "2014-06-15 13:13:13"
  //         },
  //         {
  //           price: 131,
  //           timestamp: "2014-06-15 13:13:20"
  //         },
  //       ];

        
  //       // create more trades
  //       for (const tradePayload of tradePayloads) {
  //         const response = await app.inject({
  //           method: 'POST',
  //           url: '/trades',
  //           payload: {
  //             type: TradeType.BUY,
  //             user: {
  //               id: user.id,
  //               name: user.name,
  //             },
  //             symbol: myStock.symbol,
  //             shares: 10,
  //             ...tradePayload
  //           },
  //         });
  //         expect(response.statusCode).toBe(201);
  //       }
        
  //       // lonestock 2014-06-13 - 2014-06-14
  //       let response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${loneStock.symbol}/price?start=2014-06-13&end=2014-06-14`,
  //       });
  //       let responseJson = response.json();
  //       expect(response.statusCode).toBe(200);
  //       expect(responseJson.symbol).not.toBeDefined();
  //       expect(responseJson.highest).not.toBeDefined();
  //       expect(responseJson.lowest).not.toBeDefined();
  //       expect(responseJson.message).toBeDefined();

  //       // 2014-06-13 - 2014-06-14
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=2014-06-13&end=2014-06-14`,
  //       });
  //       responseJson = response.json(); 
  //       expect(response.statusCode).toBe(200);
  //       expect(responseJson.symbol).toEqual(myStock.symbol);
  //       expect(responseJson.highest).toEqual(170);
  //       expect(responseJson.lowest).toEqual(135);

  //       // Non existent SYMBOL
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/NON-EXISTENT-SYMBOL/price?start=2014-06-13&end=2014-06-14`,
  //       });
  //       expect(response.statusCode).toBe(404);

  //       // 2014-06-13 - 2014-06-14
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=2014-06-12&end=2014-06-15`,
  //       });
  //       responseJson = response.json(); 
  //       expect(response.statusCode).toBe(200);
  //       expect(responseJson.symbol).toEqual(myStock.symbol);
  //       expect(responseJson.highest).toEqual(190);
  //       expect(responseJson.lowest).toEqual(131);

  //       // bad-start - 2014-06-14
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=bad-start&end=2014-06-15`,
  //       });
  //       expect(response.statusCode).toBe(400);

  //       // 2014-06-13 - bad-end
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=bad-start&end=2014-06-15`,
  //       });
  //       expect(response.statusCode).toBe(400);

  //       // start only
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=2014-06-14`,
  //       });
  //       responseJson = response.json();
  //       expect(response.statusCode).toBe(200);
  //       expect(responseJson.highest).toEqual(180);
  //       expect(responseJson.lowest).toEqual(131);

  //       // end only
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?end=2014-06-12`,
  //       });
  //       responseJson = response.json();
  //       expect(response.statusCode).toBe(200);
  //       expect(responseJson.highest).toEqual(190);
  //       expect(responseJson.lowest).toEqual(190);
        
  //       // empty time range
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=2014-06-11&end=2014-06-11`,
  //       });
  //       responseJson = response.json(); 
  //       expect(response.statusCode).toBe(200);
  //       expect(responseJson.symbol).not.toBeDefined();
  //       expect(responseJson.highest).not.toBeDefined();
  //       expect(responseJson.lowest).not.toBeDefined();
  //       expect(responseJson.message).toBeDefined();
        
  //       // bad time range
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/${myStock.symbol}/price?start=2014-06-16&end=2014-06-11`,
  //       });
  //       expect(response.statusCode).toBe(400);
  //     });
  //   });

  //   describe('GET /stocks/stats', () => {
  //     it('should return status 200 and return many Stock stats', async() => {
  //       const stock1 = (await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           symbol: faker.finance.currencyCode().toUpperCase(),
  //         }
  //       })).json();

  //       const stock2 = (await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           symbol: faker.finance.currencyCode().toUpperCase(),
  //         }
  //       })).json();

  //       const loneStock = (await app.inject({
  //         method: 'POST',
  //         url: '/stocks',
  //         payload: {
  //           symbol: faker.finance.currencyCode().toUpperCase(),
  //         }
  //       })).json();

  //       // stock timestamp 2014-06-12 - 2014-06-15
  //       let tradePayloads = [
  //         {
  //           symbol: stock1.symbol,
  //           price: 162.17,
  //           timestamp: "2014-06-14 13:13:13"
  //         },
  //         {
  //           symbol: stock1.symbol,
  //           price: 146.09,
  //           timestamp: "2014-06-25 13:40:13"
  //         },
  //         {
  //           symbol: stock1.symbol,
  //           price: 137.39,
  //           timestamp: "2014-06-25 13:44:13"
  //         },
  //         {
  //           symbol: stock1.symbol,
  //           price: 161.35,
  //           timestamp: "2014-06-26 13:15:18"
  //         },
  //         {
  //           symbol: stock1.symbol,
  //           price: 162.37,
  //           timestamp: "2014-06-26 15:15:18"
  //         },
  //         {
  //           symbol: stock2.symbol,
  //           price: 146.09,
  //           timestamp: "2014-06-25 13:40:13"
  //         },
  //         {
  //           symbol: stock2.symbol,
  //           price: 146.08,
  //           timestamp: "2014-06-27 10:10:31"
  //         },
  //         {
  //           symbol: stock2.symbol,
  //           price: 146.11,
  //           timestamp: "2014-06-27 11:08:23"
  //         },
  //         {
  //           symbol: stock2.symbol,
  //           price: 146.09,
  //           timestamp: "2014-06-27 12:17:17"
  //         },
  //       ];

        
  //       // create more trades
  //       for (const tradePayload of tradePayloads) {
  //         const payload = {
  //           type: TradeType.BUY,
  //           user: {
  //             id: user.id,
  //             name: user.name,
  //           },
  //           shares: 10,
  //           ...tradePayload
  //         };
  //         const response = await app.inject({
  //           method: 'POST',
  //           url: '/trades',
  //           payload,
  //         });
  //         expect(response.statusCode).toBe(201);
  //       }

  //       // 2014-06-13 - 2014-06-14
  //       let response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/stats?start=2014-06-14&end=2014-06-26`,
  //       });
  //       let responseJson = response.json();
  //       let stock1StatJson = responseJson.find((obj: any) => obj.stock === stock1.symbol);
  //       let stock2StatJson = responseJson.find((obj: any) => obj.stock === stock2.symbol);
  //       let loneStockStatJson = responseJson.find((obj: any) => obj.stock === loneStock.symbol);

  //       expect(stock1StatJson.stock).toEqual(stock1.symbol);
  //       expect(stock1StatJson.fluctuations).toEqual(1);
  //       expect(stock1StatJson.max_rise).toEqual(23.96);
  //       expect(stock1StatJson.max_fall).toEqual(16.08);
                
  //       expect(stock2StatJson.stock).toEqual(stock2.symbol);
  //       expect(stock2StatJson.fluctuations).toEqual(0);
  //       expect(stock2StatJson.max_rise).toEqual(0);
  //       expect(stock2StatJson.max_fall).toEqual(0);
                
  //       expect(loneStockStatJson.stock).toEqual(loneStock.symbol);
  //       expect(loneStockStatJson.message).toBeDefined();
  //       expect(loneStockStatJson.fluctuations).not.toBeDefined();
  //       expect(loneStockStatJson.max_rise).not.toBeDefined();
  //       expect(loneStockStatJson.max_fall).not.toBeDefined();

  //       // 2014-06-14 - 2014-06-27
  //       response = await app.inject({
  //         method: 'GET',
  //         url: `/stocks/stats?start=2014-06-14&end=2014-06-27`,
  //       });
  //       responseJson = response.json();
  //       stock1StatJson = responseJson.find((obj: any) => obj.stock === stock1.symbol);
  //       stock2StatJson = responseJson.find((obj: any) => obj.stock === stock2.symbol);
  //       loneStockStatJson = responseJson.find((obj: any) => obj.stock === loneStock.symbol);

  //       expect(stock1StatJson.stock).toEqual(stock1.symbol);
  //       expect(stock1StatJson.fluctuations).toEqual(1);
  //       expect(stock1StatJson.max_rise).toEqual(23.96);
  //       expect(stock1StatJson.max_fall).toEqual(16.08);
                
  //       expect(stock2StatJson.stock).toEqual(stock2.symbol);
  //       expect(stock2StatJson.fluctuations).toEqual(2);
  //       expect(stock2StatJson.max_rise).toEqual(0.03);
  //       expect(stock2StatJson.max_fall).toEqual(0.02);
                
  //       expect(loneStockStatJson.stock).toEqual(loneStock.symbol);
  //       expect(loneStockStatJson.message).toBeDefined();
  //       expect(loneStockStatJson.fluctuations).not.toBeDefined();
  //       expect(loneStockStatJson.max_rise).not.toBeDefined();
  //       expect(loneStockStatJson.max_fall).not.toBeDefined();
  //     });
  //   });
  // });
});
