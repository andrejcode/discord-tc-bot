import 'dotenv/config';
import createApp from './app';
import createDatabase from './database';

const { DATABASE_URL, PORT } = process.env;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

const database = createDatabase(DATABASE_URL);
const app = createApp(database);

app.listen(PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT || 3000}`);
});
