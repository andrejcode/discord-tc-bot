import express from 'express';
import messages from './modules/messages/controller';
import sprints from './modules/sprints/controller';
import type { Database } from '@/database';
import { createNewClient } from './api/discord';

export const discordClient = createNewClient();

export default function createApp(db: Database) {
  const app = express();

  app.use(express.json());

  app.use('/messages', messages(db, discordClient));
  app.use('/sprints', sprints(db));

  return app;
}
