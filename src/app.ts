import { envs } from './config/envs.js';
import { MongoDatabase } from './data/mongodb/mongo-database.js';
import { AppRoutes } from './presentation/routes.js';
import { Server } from './presentation/server.js';

(() => {
  main();
})();

async function main() {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}
