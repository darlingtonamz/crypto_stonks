import { Initializer, Destructor, Service } from 'fastify-decorators';
import configuration from '../../config/configuration';
import { createConnection, Connection } from 'typeorm';
const { database: { type: dbType, host, port, username, password, database, entities, namingStrategy } } = configuration();

@Service()
export class ConnectionService {
  connection!: Connection;

  @Initializer()
  async init(): Promise<void> {
    this.connection = await createConnection({
      type: dbType as 'postgres',
      host,
      port,
      username,
      password,
      database,
      entities,
      namingStrategy,
      synchronize: false, // prevent auto migration based on entity edits
    });
  }

  @Destructor()
  async destroy(): Promise<void> {
    await this.connection.close();
  }
}