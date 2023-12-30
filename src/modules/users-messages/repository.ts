import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import { keys } from './schema';
import type { UsersMessages, Database, DB } from '@/database';

const TABLE = 'usersMessages';
type TableName = typeof TABLE;
type Row = UsersMessages;
type RowWithoutId = Omit<Row, 'id'>;
type RowRelationshipsIds = Pick<Row, 'userId' | 'messageId'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },

  find(
    expression: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).where(expression).execute();
  },

  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst();
  },

  findAllByUserId(userId: number): Promise<RowSelect[] | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('userId', '=', userId)
      .execute();
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
  const { messageId, userId } = record;

  // we would perform both checks in a single Promise.all
  if (messageId) {
    const article = await db
      .selectFrom('messages')
      .select('id')
      .where('id', '=', messageId)
      .executeTakeFirst();

    if (!article) {
      throw new Error('Referenced message does not exist.');
    }
  }

  if (userId) {
    const user = await db
      .selectFrom('users')
      .select('id')
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw new Error('Referenced user does not exist.');
    }
  }
}
