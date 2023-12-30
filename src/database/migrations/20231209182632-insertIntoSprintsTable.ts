import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db
    .insertInto('sprints' as any)
    .values([
      {
        sprint_code: 'WD-1.1',
        sprint_title: 'First Steps Into Programming with Python',
        message_id: 1,
      },
      {
        sprint_code: 'WD-1.2',
        sprint_title: 'Intermediate Programming with Python',
        message_id: 2,
      },
      {
        sprint_code: 'WD-1.3',
        sprint_title: 'Object Oriented Programming',
        message_id: 3,
      },
      {
        sprint_code: 'WD-1.4',
        sprint_title: 'Computer Science Fundamentals',
        message_id: 4,
      },
      {
        sprint_code: 'WD-2.1',
        sprint_title: 'HTML and CSS - the Foundation of Web Pages',
        message_id: 5,
      },
      {
        sprint_code: 'WD-2.2',
        sprint_title: 'Improving Websites with Javascript',
        message_id: 6,
      },
      {
        sprint_code: 'WD-2.3',
        sprint_title: 'Learning Your First Framework - Vue.js',
        message_id: 7,
      },
      {
        sprint_code: 'WD-2.4',
        sprint_title: 'Typing and Testing JavaScript',
        message_id: 8,
      },
      {
        sprint_code: 'WD-3.1',
        sprint_title: 'Node.js and Relational Databases',
        message_id: 9,
      },
      {
        sprint_code: 'WD-3.2',
        sprint_title: 'REST APIs & Test Driven Development',
        message_id: 10,
      },
    ])
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.deleteFrom('sprints' as any).execute();
}
