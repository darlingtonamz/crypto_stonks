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
import { SocketStream } from "fastify-websocket";
import AssetPriceRefreshScheduler from "./schedulers/AssetPriceRefreshScheduler";

const Ajv = require('ajv').default;
const AjvErrors = require('ajv-errors');

export const appModules: IAppModule[] = [
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


  server.register(require('fastify-websocket'), {
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

    if (!origin) {
      // temporarily allow no origin this because of api/example.http
      corsOptions = { origin: false }
      // return;
    } else {
      const hostname = new URL(origin).hostname;
  
      if(hostname === 'localhost'){
        corsOptions = { origin: false }
      } else {
        corsOptions = { origin: true }
      }
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
      // message to client after connecting to server
      conn.socket.send(`Hello client - You are connected to Server successfully`);
      
      // this is where the server responds to the message from the client
      conn.socket.on("message", (message) => {
        conn.socket.send(`We see your message but can't handle it at the moment ... ("${message}")`)
      });
    }
  })
  
  /* SCHEDULER ---------------------- */
  server.register(fastifySchedule);
  (new AssetPriceRefreshScheduler()).start(server);
  /* ---------------------- SCHEDULER */

  return server;
}

export default build;
