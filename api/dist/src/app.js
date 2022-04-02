"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appModules = void 0;
require("reflect-metadata");
const fastify_1 = require("fastify");
const assetPrices_module_1 = require("./assetPrices/assetPrices.module");
const fastify_decorators_1 = require("fastify-decorators");
const fastify_schedule_1 = require("fastify-schedule");
const assets_module_1 = require("./assets/assets.module");
const toad_scheduler_1 = require("toad-scheduler");
const Ajv = require('ajv').default;
const AjvErrors = require('ajv-errors');
exports.appModules = [
    assetPrices_module_1.AssetPricesModule,
    assets_module_1.AssetsModule,
];
function build(appOptions = {}) {
    const server = fastify_1.default(Object.assign({}, appOptions));
    const ajv = new Ajv({
        allErrors: true,
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
    });
    AjvErrors(ajv);
    server.setValidatorCompiler(({ schema }) => {
        const validation = ajv.compile(schema);
        return validation;
    });
    let controllers = [];
    for (const module of exports.appModules) {
        controllers = controllers.concat(module.controllers);
    }
    server.register(require('fastify-websocket'), {
        options: { maxPayload: 1048576 }
    });
    server.register(fastify_decorators_1.bootstrap, {
        controllers
    });
    server.get('/health', {}, () => __awaiter(this, void 0, void 0, function* () {
        return { pong: 'it worked!' };
    }));
    server.route({
        method: 'GET',
        url: '/ws',
        handler: (_, reply) => {
            reply.send({ hello: 'world' });
        },
        wsHandler: (conn) => {
            conn.setEncoding('utf8');
            conn.write('hello client');
            conn.once('data', () => {
                conn.end();
            });
        }
    });
    server.register(fastify_schedule_1.fastifySchedule);
    const task = new toad_scheduler_1.AsyncTask('simple task', () => __awaiter(this, void 0, void 0, function* () {
        const result = (yield server.inject({
            method: 'POST',
            url: '/price',
            payload: {
                from: ['BTC', 'LINK', 'MKR', 'USD', 'EUR', 'ETH', 'LTC'],
                to: []
            }
        })).json();
        console.info(`(${result.length}) PRICE(S) UPDATED !!!!!!!!!!!`);
        return Promise.resolve();
    }), (err) => { console.error(err); });
    const job = new toad_scheduler_1.SimpleIntervalJob({ seconds: 60, }, task);
    server.ready().then(() => {
        console.log('fastify.ready(), successfully booted!');
        server.scheduler.addSimpleIntervalJob(job);
    }, (err) => {
        console.log('an error happened', err);
    });
    return server;
}
exports.default = build;
//# sourceMappingURL=app.js.map