import express from 'express';
import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
import swaggerDocs from './utils/swagger';

// Handling uncaught exceptions
process.on('uncaughtException', (err: any) => {
  logger.info('Uncaught Exception! Shutting down...');
  logger.error(err.name, err.message);

  process.exit(1);
});

const port = config.get<number>('port');

const app = express();

app.use(express.json());
app.use(deserializeUser);

// Starting up server
const server = app.listen(port, async () => {
  logger.info(`App is running at https://localhost:${port}`);
  await connect();

  routes(app);
  swaggerDocs(app, port);
});

// Handling promise rejections
process.on('unhandledRejection', (err: any) => {
  logger.info('Unhandled Rejection! Shutting down...');
  logger.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
