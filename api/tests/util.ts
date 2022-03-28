import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Connection } from 'typeorm';
import appBuild from '../src/app';

export const createApp = async (): Promise<FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>> => {
  return appBuild();
};

// TODO: optimize function
export const clearDatabase = async (connection: Connection): Promise<void> => {
  const entities = connection.entityMetadatas;

  try {
    await connection.query("SET session_replication_role = 'replica';");
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const entity of entities) {
    // eslint-disable-next-line no-await-in-loop
    const repository = await connection.getRepository(entity.name);
    try {
      // eslint-disable-next-line no-await-in-loop
      const [{ exists }] = await repository.query(`SELECT EXISTS (
               SELECT 1
               FROM   information_schema.tables
               WHERE  table_schema = 'public'
               AND    table_name = '${entity.tableName}'
           )`);

      if (exists) {
        // eslint-disable-next-line no-await-in-loop
        await repository.query(`DELETE FROM "public"."${entity.tableName}";`);
      }
    } catch (e) {
      /* eslint-disable no-console */
      console.log(e);
    }
  }
};
