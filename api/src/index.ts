import "reflect-metadata";
import config from './config/configuration';
import appBuild from './app';

const { port: PORT } = config();
const server = appBuild({
  logger: true,
})

server.listen(PORT, '0.0.0.0', (err: any) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
});
