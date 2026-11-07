import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));


app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', errors: [] });
});

app.use(errorHandler);

export default app;
