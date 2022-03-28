import { Constructor } from "fastify-decorators/decorators/helpers/inject-dependencies";

export interface IAppModule {
  controllers: Constructor<unknown>[];
}