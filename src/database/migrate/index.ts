/* eslint-disable no-console */
import 'dotenv/config';
import { type Kysely, type MigrationProvider, Migrator } from 'kysely';

// eslint-disable-next-line import/prefer-default-export
export async function migrateToLatest(
  provider: MigrationProvider,
  db: Kysely<any>
) {
  // const provider = getProvider();
  const migrator = new Migrator({
    db,
    provider,
  });

  return migrator.migrateToLatest();
}
