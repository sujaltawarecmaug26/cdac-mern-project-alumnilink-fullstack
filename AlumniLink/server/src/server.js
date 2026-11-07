import app from './app.js';
import env from './config/env.js';
import { connectDb } from './config/db.js';

async function boot() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`AlumniLink API listening on port ${env.port}`);
  });
}

boot().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
