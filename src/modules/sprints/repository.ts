import type { Insertable, Selectable, Updateable } from 'kysely';
import { keys } from './schema';
import type { Sprints, Database } from '@/database';

const TABLE = 'sprints';
type Row = Sprints;
type RowWithoutId = Omit<Row, 'id'>;
type RowRelationshipsIds = Pick<Row, 'messageId'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  findBySprintCode(sprintCode: string): Promise<RowSelect[]> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('sprintCode', '=', sprintCode)
      .execute();
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst();
  },

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    await assertRelationshipsExist(db, record);

    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },

  async update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id);
    }

    await assertRelationshipsExist(db, partial);

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },
});

/**
 * Enforce that provided relationships reference existing keys.
 */
async function assertRelationshipsExist(
  db: Database,
  record: Partial<RowRelationshipsIds>
) {
  const { messageId } = record;

  // we would perform both checks in a single Promise.all
  if (messageId) {
    const message = await db
      .selectFrom('messages')
      .select('id')
      .where('id', '=', messageId)
      .executeTakeFirst();

    if (!message) {
      throw new Error('Referenced message does not exist.');
    }
  }
}
