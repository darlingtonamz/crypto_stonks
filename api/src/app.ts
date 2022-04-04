import "reflect-metadata";
import Fastify, {
  FastifyInstance, FastifyRequest,
} from 'fastify';
import { AssetPricesModule } from "./assetPrices/assetPrices.module";
import { bootstrap } from 'fastify-decorators';
import { Constructor } from "fastify-decorators/decorators/helpers/inject-dependencies";
import { fastifySchedule } from 'fastify-schedule';
import { IAppModule } from "./common/interfaces/interfaces";
import { AssetsModule } from "./assets/assets.module";
// import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { SocketStream } from "fastify-websocket";
// import configuration from "./config/configuration";
import AssetPriceRefreshScheduler from "./schedulers/AssetPriceRefreshScheduler";
// import FastifyWebsocket from 'fastify-websocket';
// import { WebSocketServer } from "ws";
// import { Connection } from "typeorm";
// const { fastifySchedulePlugin } = require('fastify-schedule')
// import { UsersModule } from "./users/users.module";

const Ajv = require('ajv').default;
const AjvErrors = require('ajv-errors');
// const allowedAssetSymbols = (process.env.ALLOWED_ASSET_SYMBOLS || 'btc')
//   .split(',')
//   .map((str) => str.trim())
// const allowedAssetSymbols = configuration().allowedAssetSymbols;

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

  // function handle (conn: any) {
  //   conn.pipe(conn) // creates an echo server
  // }
  server.register(require('fastify-websocket'), {
    // handle,
    options: { maxPayload: 1048576 }
  });
  server.register(bootstrap, {
    controllers: [
      ...controllers,
      AssetPriceRefreshScheduler
    ],
    
  });
  server.register(require('fastify-cors'), () => (req: FastifyRequest, callback: any) => {
    let corsOptions;
    const origin = req.headers.origin as string;
    // do not include CORS headers for requests from localhost
    // console.log('############', {origin, req})
    if (!origin) {
      return;
    }
    const hostname = new URL(origin).hostname;
    // console.log('############', {hostname})
    // const allowedHostNames = ['localhost', '0.0.0.0', '127.0.0.1', 'ui.amanze.local']
    // if(allowedHostNames.includes(hostname)){
    if(hostname === 'localhost'){
      corsOptions = { origin: false }
    } else {
      corsOptions = { origin: true }
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  });

  server.get('/health', {}, async () => {
    return { pong: 'it worked!' }
  });
  server.route({
    method: 'GET',
    url: '/ws',
    handler: (_, reply) => {
      // this will handle http requests
      reply.send({ hello: 'world' })
    },
    wsHandler: (conn: SocketStream) => {
      // this will handle websockets connections
      // conn.setEncoding('utf8')
      // conn.write('hello client')
  
      // conn.once('data', () => {
      //   conn.end()
      // })

      // message to client after connecting to server
      conn.socket.send(`Hello client - You are connected to Server successfully`);
      
      // this is where the server responds to the message from the client
      conn.socket.on("message", (message) => {
        // const messageText = message.toString();
        // // const allowedAssetSymbols = ['BTC','LINK','MKR', 'USD','EUR','ETH','LTC'];
        // console.log('Message from FE', { message: message.toString() });
        // const [messageCommand, assetSymbol] = messageText.split('|')
        // if (
        //   messageCommand === 'HAS_UPDATE_FOR' &&
        //   allowedAssetSymbols.includes(assetSymbol)
        // ) {
        //   // conn.socket.send(`${pricesUpdatedAt}`);
        //   conn.socket.send(`QQQQQQQQQQQQQQQ`);
        // } else {
        //   conn.socket.send('We see your message but can\'t handle it at the moment ...')
        // }
        conn.socket.send(`We see your message but can't handle it at the moment ... ("${message}")`)
        // conn.socket.send(`hello client | ${message}`);
      });

      // conn.socket.
    }
  })
  
  /* SCHEDULER ---------------------- */
  // @Inject(AssetsService)
  // private assetsService!: AssetsService;
  // server.
  server.register(fastifySchedule);
  /*
  //  let pricesUpdatedAt: number;
   // https://github.com/fastify/fastify-schedule
   const task = new AsyncTask(
       'simple task',
       async () => {
        //  const result = 
         (await server.inject({
            method: 'POST',
            url: '/price',
            payload: {
              from: allowedAssetSymbols,
              to: []
            }
          }).catch((err) => console.log('ERRRRRRRRRR', err))
         )
        //  .json();
        //  pricesUpdatedAt = new Date().getTime();
        //  console.info(`(${result.length}) PRICE(S) UPDATED !!!!!!!!!!!`);
         return Promise.resolve();
         // return null;
       },
       (err: Error) => { console.error(err) }
   )
   const job = new SimpleIntervalJob({ seconds: 60, }, task)
  
   server.ready().then(() => {
     console.log('fastify.ready(), successfully booted!')
     
     server.scheduler.addSimpleIntervalJob(job)
     
   }, (err) => {
     console.log('an error happened', err);
   });
  */
  (new AssetPriceRefreshScheduler()).start(server);
  /* ---------------------- SCHEDULER */

  return server;
}

export default build;
