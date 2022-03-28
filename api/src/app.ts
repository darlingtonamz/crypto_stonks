import "reflect-metadata";
import Fastify, {
  FastifyInstance,
} from 'fastify';
import { AssetPricesModule } from "./assetPrices/assetPrices.module";
import { bootstrap } from 'fastify-decorators';
import { Constructor } from "fastify-decorators/decorators/helpers/inject-dependencies";
import { fastifySchedule } from 'fastify-schedule';
import { IAppModule } from "./common/interfaces/interfaces";
import { AssetsModule } from "./assets/assets.module";
import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
// import { Connection } from "typeorm";
// const { fastifySchedulePlugin } = require('fastify-schedule')
// import { UsersModule } from "./users/users.module";

const Ajv = require('ajv').default;
const AjvErrors = require('ajv-errors');

export const appModules: IAppModule[] = [
  // UsersModule,
  AssetPricesModule,
  AssetsModule,
];

function build(appOptions={}) {
  const server: FastifyInstance = Fastify({
    ...appOptions
  });

  const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
  });
  // enhance the ajv instance
  AjvErrors(ajv)
  
  server.setValidatorCompiler(({ schema }) => {
    const validation = ajv.compile(schema);
    return validation;
  });
  
  let controllers: Constructor<unknown>[] = [];
  for (const module of appModules) {
    controllers = controllers.concat(module.controllers)
  }
  server.register(bootstrap, {
    controllers
  });
  
  server.get('/health', {}, async () => {
    return { pong: 'it worked!' }
  });
  
  /* SCHEDULER ---------------------- */
  // @Inject(AssetsService)
  // private assetsService!: AssetsService;
  // server.
  server.register(fastifySchedule);

  // https://github.com/fastify/fastify-schedule
  const task = new AsyncTask(
      'simple task',
      // () => { return db.pollForSomeData().then((result) => { /* continue the promise chain */ }) },
      async () => {
        const result = (await server.inject({
          method: 'POST',
          url: '/price?fsyms=BTC,LINK,MKR',
          payload: {
            from: ['BTC','LINK','MKR', 'USD','EUR','ETH','LTC'],
            to: []
          }
        })).json();
        console.info(`(${result.length}) PRICE(S) UPDATED !!!!!!!!!!!`);
        return Promise.resolve();
        // return null;
      },
      (err: Error) => { console.error(err) }
  )
  const job = new SimpleIntervalJob({ seconds: 60, }, task)

  // server.scheduler.addSimpleIntervalJob(job)
  server.ready().then(() => {
    console.log('fastify.ready(), successfully booted!')
    
    server.scheduler.addSimpleIntervalJob(job)
    
  }, (err) => {
    console.log('an error happened', err);
  })
  /* ---------------------- SCHEDULER */

  return server;
}

export default build;
