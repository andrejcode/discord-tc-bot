import 'dotenv/config';
import createApp, { discordClient } from './app';
import createDatabase from './database';
import { logoutClient, loginClient } from './api/discord/index';

const { DATABASE_URL, PORT } = process.env;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

const database = createDatabase(DATABASE_URL);
const app = createApp(database);

const server = app.listen(PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT || 3000}`);

  loginClient(discordClient);
});

process.on('SIGINT', () => {
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server closed.');
    logoutClient(discordClient);
    process.exit(0);
  });
});
