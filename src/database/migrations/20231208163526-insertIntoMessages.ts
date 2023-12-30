import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db
    .insertInto('messages' as any)
    .values([
      {
        message:
          'Congratulations on your well-deserved success! Your hard work and dedication have truly paid off.',
      },
      {
        message:
          'Congratulations on your well-deserved success! Cheers to your achievements and the exciting journey ahead!',
      },
      {
        message:
          "You've reached a significant milestone, and I couldn't be happier for you. Congratulations on this fantastic accomplishment!",
      },
      {
        message:
          "Kudos on your success! Your perseverance and positive attitude have set you apart, and I'm thrilled to see you achieve your goals.",
      },
      {
        message:
          "Well done! Your accomplishments speak volumes about your talent and commitment. Here's to even more success in the future.",
      },
      {
        message:
          'Heartiest congratulations on your outstanding achievement! Your determination and passion have led you to this well-deserved success.',
      },
      {
        message:
          'What an incredible accomplishment! Your success is a result of your unwavering dedication and the excellence you bring to everything you do.',
      },
      {
        message:
          'Congratulations on reaching this important milestone. Your success is a reflection of your hard work, passion, and unwavering commitment.',
      },
      {
        message:
          'Hats off to you! Your success is not just a win for you but also a source of inspiration for everyone fortunate enough to know you.',
      },
      {
        message:
          'Your achievements are truly commendable, and I want to extend my warmest congratulations. May this success be the beginning of even greater things to come!',
      },
    ])
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.deleteFrom('messages' as any).execute();
}
