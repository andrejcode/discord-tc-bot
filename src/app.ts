/* eslint-disable no-console */
import express from 'express';
import messages from './modules/messages/controller';
import sprints from './modules/sprints/controller';
import type { Database } from '@/database';

export default function createApp(db: Database) {
  const app = express();

  app.use(express.json());

  app.use('/messages', messages(db));
  app.use('/sprints', sprints(db));

  return app;
}
