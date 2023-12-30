import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('sprints')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('sprint_code', 'text', (c) => c.notNull())
    .addColumn('sprint_title', 'text', (c) => c.notNull())
    .addColumn('message_id', 'integer', (c) =>
      c.references('messages.id').notNull()
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('messages').execute();
}
