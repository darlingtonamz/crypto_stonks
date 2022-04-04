import { FastifyInstance } from "fastify";
import { Controller, Inject } from "fastify-decorators";
import { AssetPricesService } from "../assetPrices/providers/assetPrices.service";
import { WebSocket } from 'ws';
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import configuration from "../config/configuration";

const { allowedAssetSymbols, priceRefreshDelayInSecond} = configuration();

@Controller()
class AssetPriceRefreshScheduler {
  @Inject(AssetPricesService)
  private service!: AssetPricesService;

  constructor() {
    if (!AssetPriceRefreshScheduler._instance) {
      // this.server = server
      AssetPriceRefreshScheduler._instance = this;
      // console.log('########### 1', { allowedAssetSymbols })
    } else {
      // console.log('########### 2')
      return AssetPriceRefreshScheduler._instance;
    }
  }
  private static _instance: AssetPriceRefreshScheduler;

  // private server: FastifyInstance;

  public pricesUpdatedAt: number;

  public isRunning = false;

  public start(server: FastifyInstance): void {

    if (!this.isRunning) {
      const task = new AsyncTask(
          'simple task',
          async () => {
            const result = await this.service.syncAndUpdateAssetPrices(allowedAssetSymbols)
  
            this.pricesUpdatedAt = new Date().getTime();
            console.info(`(${result.length}) PRICE(S) UPDATED !!!!!!!!!!!`);
            // const pricesText
            server.websocketServer.clients.forEach((client: WebSocket) => {
              if (client.readyState === 1) {
                client.send(JSON.stringify({
                  message: 'ASSET_PRICE_UPDATED',
                }));
              }
            })
            return Promise.resolve();
          },
          (err: Error) => { console.error(err) }
      )
      const job = new SimpleIntervalJob({ seconds: priceRefreshDelayInSecond, }, task)
  
      server.ready().then(() => {
        console.log('fastify.ready(), successfully booted!')
        
        server.scheduler.addSimpleIntervalJob(job);
        this.isRunning = true;
        
      }, (err: Error) => {
        console.log('an error happened', err);
      });
    }
  }
}

export default AssetPriceRefreshScheduler;